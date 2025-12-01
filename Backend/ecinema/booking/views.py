from datetime import timedelta
from decimal import Decimal

from django.db import transaction, models
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.mail import send_mail

from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Booking, Ticket, TicketType
from accounts.models import Account, CustomUser
from .serializers import BookingSerializer
from .factories import AdultTicketFactory, SeniorTicketFactory, ChildTicketFactory
from movie.models import MovieShow, Seat

# how long a temporary hold lasts
HOLD_MINUTES = 5


# Create your views here.
class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

def getUserBooking(request):
    if request.user.is_authenticated:
        user = request.user
        bookings = Booking.objects.filter(user=user)
        result = []

        for booking in bookings:
            books = {
                "id": booking.id,
                "no_of_tickets": booking.no_of_tickets,
                "total_price": str(booking.total_price),
                "booking_time": booking.booking_time,
                "status": booking.status,
                "show": {
                    "movie": booking.show.movie.title,
                    "showtime": booking.show.show_start_time
                },
                "card_id": booking.card.get_last4(),
                }
            tickets = booking.booking_seats.all().values(
                'id', 'ticket_type_id__name', 'seat__auditorium__name', 'seat__row_number', 'seat__seat_number', 'price'
            )

            books["tickets"] = list(tickets)
            result.append(books)

        return JsonResponse({'status': 'success', 'message': 'User is logged in!', 'bookings': result}, status=200)
    return JsonResponse({'status': 'error', 'message': 'User is not logged in!'})

# ---- HOLD SEATS (TEMP BOOKING) ----
@api_view(["POST"])
def hold_seats(request, show_id):
    """
    Create a temporary Booking (status='HELD') for selected seats on a show.
    Fails with 409 if any seat is already taken/active-held.
    """
    user = request.user
    data = request.data

    seat_ids = data.get("seatIds", [])
    ticket_type_id = data.get("ticketTypeId")  # optional
    promo_code = data.get("promoCode")

    if not seat_ids:
        return Response(
            {"detail": "seatIds is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    show = get_object_or_404(MovieShow, id=show_id)
    now = timezone.now()
    expires_at = now + timedelta(minutes=HOLD_MINUTES)

    with transaction.atomic():
        # 1. Check all requested seats are still available
        for seat_id in seat_ids:
            conflict = (
                Ticket.objects.filter(
                    seat_id=seat_id,
                    booking__show=show,
                )
                .filter(
                    models.Q(booking__status="CONFIRMED")
                    | models.Q(
                        booking__status="HELD",
                        booking__hold_expires_at__gt=now,
                    )
                )
                .exclude(booking__user=user)
                .exists()
            )

            if conflict:
                return Response(
                    {
                        "detail": f"Seat {seat_id} is no longer available.",
                        "conflictSeat": seat_id,
                    },
                    status=status.HTTP_409_CONFLICT,
                )

        # 2. Determine ticket type & price (basic version)
        ticket_type = None
        price_per_ticket = Decimal("0.00")
        if ticket_type_id:
            ticket_type = get_object_or_404(TicketType, id=ticket_type_id)
            price_per_ticket = ticket_type.price

        no_of_tickets = len(seat_ids)
        total_price = price_per_ticket * no_of_tickets

        # 3. Create Booking in HELD state
        booking = Booking.objects.create(
            user=user,
            show=show,
            card=None,
            no_of_tickets=no_of_tickets,
            total_price=total_price,
            promo_code=promo_code or None,
            status="HELD",
            hold_expires_at=expires_at,
        )

        # 4. Create Tickets for each seat
        ticket_ids = []
        for seat_id in seat_ids:
            seat = get_object_or_404(Seat, id=seat_id)
            ticket = Ticket.objects.create(
                booking=booking,
                ticket_type=ticket_type,
                seat=seat,
                price=price_per_ticket,
            )
            ticket_ids.append(ticket.id)

    return Response(
        {
            "bookingId": booking.id,
            "ticketIds": ticket_ids,
            "holdExpiresAt": expires_at,
        },
        status=status.HTTP_201_CREATED,
    )

@api_view(["POST"])
def release_seat(request, show_id, seat_id):
    user = request.user
    try:
        ticket = Ticket.objects.get(
            booking__show_id=show_id,
            seat_id=seat_id,
            booking__user=user,
            booking__status="HELD",
        )
        ticket.delete()  # or cancel booking if last seat
        booking = ticket.booking
        booking.no_of_tickets = booking.no_of_tickets - 1
        booking.save()
        if booking.no_of_tickets == 0:
            booking.delete()

        return Response({"detail": "Seat released"})
    except Ticket.DoesNotExist:
        return Response({"detail": "No held seat found"}, status=404)

# ---- CONFIRM BOOKING (HELD -> CONFIRMED) ----
@api_view(["POST"])
def confirm_booking(request, booking_id):
    """
    Turn a HELD booking into a CONFIRMED booking if it hasn't expired.
    """
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    now = timezone.now()

    # Must be in HELD state
    if booking.status != "HELD":
        return Response(
            {"detail": "Booking is not in HELD state."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Hold missing or expired -> cancel and ask to reselect
    if not booking.hold_expires_at or booking.hold_expires_at <= now:
        booking.status = "CANCELLED"
        booking.save()
        return Response(
            {"detail": "Hold expired. Please choose seats again."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    seats_data = request.data.get("seats", [])
    tickets = {
        "Adult": AdultTicketFactory(),
        "Senior": SeniorTicketFactory(),
        "Child": ChildTicketFactory()
    }

    total_price = Decimal('0.00')
    for s in seats_data:
        seat_id = s["seat_id"]
        ticket_type = TicketType.objects.get(name=s["ticket_type"])
        factory = tickets.get(ticket_type.name)
        ticket = factory.order_ticket()
        price = ticket.get_price()

        ticket = booking.booking_seats.get(seat_id=seat_id)
        ticket.ticket_type = ticket_type
        ticket.price = price
        ticket.save()

        total_price += price

    discount = Decimal(request.data.get('discount'))
    if discount != 0:
        total_price = total_price - ((discount / 100) * total_price)

    card_id = get_object_or_404(Account, id=request.data.get('card'))
    user = get_object_or_404(CustomUser, id=booking.user.id)
    booking.total_price = total_price
    booking.card = card_id
    booking.card4 = card_id.get_last4
    booking.status = 'CONFIRMED'
    booking.hold_expires_at = None
    booking.save()

    try:
        send_mail(
            'Your booking was successful!',
            f'We hope you enjoy the movie!',
            'your_email@gmail.com',
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f'Email send failed: {e}')

    ser = BookingSerializer(booking)

    return Response(
        {"detail": "Booking confirmed.", "booking": ser.data},
        status=status.HTTP_200_OK,
    )