from decimal import Decimal
from django.utils import timezone
from accounts.models import Account
from .models import TicketType, Ticket
from .factories import AdultTicketFactory, SeniorTicketFactory, ChildTicketFactory

class BookingBuilder:
    def __init__(self, booking):
        self.booking = booking
        self.total_price = Decimal("0.00")
        self._discount = Decimal("0")

    def ensure_held_and_valid(self):
        if self.booking.status != "HELD":
            raise ValueError("Booking is not in HELD state.")
        if not self.booking.hold_expires_at or self.booking.hold_expires_at <= timezone.now():
            self.booking.status = "CANCELLED"
            self.booking.save()
            raise ValueError("Booking hold expired. Please choose seats again.")
        return self

    def apply_seats(self, seats_data):
        tickets = {
            "Adult": AdultTicketFactory(),
            "Senior": SeniorTicketFactory(),
            "Child": ChildTicketFactory()
        }

        for s in seats_data:
            seat_id = s["seat_id"]
            ticket_type = TicketType.objects.get(name=s["ticket_type"])
            factory = tickets.get(ticket_type.name)

            ticket = factory.order_ticket()
            price = ticket.get_price()

            ticket = self.booking.booking_seats.get(seat_id=seat_id)
            ticket.ticket_type = ticket_type
            ticket.price = price
            ticket.save()

            self.total_price += price
        return self

    def apply_discount(self, discount):
        discount = Decimal(discount)
        if discount != 0:
            self.total_price -= (self.total_price * (discount / 100))
        return self

    def with_card(self, card_id):
        card = Account.objects.get(id=card_id)
        self.booking.card = card
        self.booking.card4 = card.get_last4
        return self

    def confirm(self):
        self.booking.total_price = self.total_price
        self.booking.status = "CONFIRMED"
        self.booking.hold_expires_at = None
        self.booking.save()
        return self.booking