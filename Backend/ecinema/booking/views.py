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

from .builder import BookingBuilder
from .models import Booking, Ticket, TicketType
from .serializers import BookingSerializer
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
        bookings = Booking.objects.filter(user=user).order_by("-booking_time")
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
                "card_id": booking.card.get_last4() if booking.card else "----",
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
            {"status": "error", "detail": "seatIds is required."},
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
                        "status": "error",
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
            "status": "success",
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

        return Response({"status": "success", "detail": "Seat released"})
    except Ticket.DoesNotExist:
        return Response({"status": "error", "detail": "No held seat found"}, status=404)

# ---- CONFIRM BOOKING (HELD -> CONFIRMED) ----
@api_view(["POST"])
def confirm_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)

    seats = request.data.get("seats", [])
    discount = request.data.get("discount", 0)
    card_id = request.data.get("card")

    builder = BookingBuilder(booking)

    try:
        booking = (
            builder.ensure_held_and_valid()
                   .apply_seats(seats)
                   .apply_discount(discount)
                   .with_card(card_id)
                   .confirm()
        )
    except ValueError as e:
        return Response({"status": "error", "detail": str(e)}, status=400)

    try:
        send_mail(
            "Your booking was successful!",
            "We hope you enjoy the movie!",
            "your_email@gmail.com",
            [booking.user.email],
            fail_silently=True,
        )
    except Exception:
        pass

    ser = BookingSerializer(booking)
    return Response(
        {"status": "success", 
         "detail": "Booking confirmed.", 
         "booking": ser.data},
        status=status.HTTP_200_OK,
    )