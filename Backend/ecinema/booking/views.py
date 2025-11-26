from datetime import timedelta
from decimal import Decimal

from django.db import transaction, models
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Booking, Ticket, TicketType
from .serializers import BookingSerializer
from movie.models import MovieShow, Seat

# how long a temporary hold lasts
HOLD_MINUTES = 5


# ---- VIEWSET ----
class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


# ---- getUser VIEW ----
def getUser(request):
    if request.user.is_authenticated:
        user_data = {
            "username": request.user.username,
            "email": request.user.email,
            "id": request.user.id,
        }
        return JsonResponse(
            {
                "status": "success",
                "message": "User is logged in!",
                "user": user_data,
            },
            status=200,
        )
    return JsonResponse(
        {"status": "error", "message": "User is not logged in!"}, status=200
    )


# ---- GET ALL SEATS FOR A SHOW WITH STATUS ----
@api_view(["GET"])
@permission_classes([AllowAny])
def get_show_seats(request, show_id):
    """
    Return all seats for a given MovieShow, with status:
      - 'available'
      - 'held' (temporarily reserved, not yet purchased)
      - 'purchased'
    """
    show = get_object_or_404(MovieShow, id=show_id)
    now = timezone.now()

    # All tickets for this show
    tickets = (
        Ticket.objects.filter(booking__show=show)
        .select_related("booking", "seat")
    )

    taken_seat_ids = set()
    held_seat_ids = set()

    for t in tickets:
        booking = t.booking

        # Fully purchased seats
        if booking.status == "CONFIRMED":
            taken_seat_ids.add(t.seat_id)

        # Held seats
        elif booking.status == "HELD":
            # If hold has an expiry and it's still in the future -> treat as held
            if booking.hold_expires_at and booking.hold_expires_at > now:
                held_seat_ids.add(t.seat_id)
            # If no expiry (older data) -> treat as purchased
            elif not booking.hold_expires_at:
                taken_seat_ids.add(t.seat_id)
            # Else: hold expired -> ignore (seat becomes available)

        # Cancelled or anything else -> ignore (available)

    # All seats in this show's auditorium
    seats = Seat.objects.filter(auditorium=show.auditorium).order_by("id")

    result = []
    for seat in seats:
        if seat.id in taken_seat_ids:
            status_str = "purchased"
        elif seat.id in held_seat_ids:
            status_str = "held"
        else:
            status_str = "available"

        result.append(
            {
                "id": seat.id,
                # Adjust these to your actual Seat fields if different
                "row": getattr(seat, "row", None),
                "number": getattr(
                    seat,
                    "seat_number",
                    seat.seat_number if hasattr(seat, "seat_number") else None,
                ),
                "status": status_str,
            }
        )

    return Response(result)


# ---- HOLD SEATS (TEMP BOOKING) ----
@api_view(["POST"])
@permission_classes([IsAuthenticated])
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


# ---- CONFIRM BOOKING (HELD -> CONFIRMED) ----
@api_view(["POST"])
@permission_classes([IsAuthenticated])
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

    # Hold is still valid -> confirm booking
    booking.status = "CONFIRMED"
    booking.hold_expires_at = None
    booking.save()

    return Response(
        {"detail": "Booking confirmed.", "bookingId": booking.id},
        status=status.HTTP_200_OK,
    )
