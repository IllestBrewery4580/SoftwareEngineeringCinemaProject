from django.db import models
from django.utils import timezone
from accounts.models import CustomUser, Account
from movie.models import MovieShow

class TicketType(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.name} - ${self.price}"

class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    show = models.ForeignKey(MovieShow, on_delete=models.CASCADE)
    card = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    no_of_tickets = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code = models.CharField(max_length=20, null=True, blank=True)
    booking_time = models.DateTimeField(auto_now_add=True)

    # New fields for temp holds
    STATUS_CHOICES = [
        ("HELD", "Held"),               # seats picked, not paid yet
        ("CONFIRMED", "Confirmed"),     # paid / final
        ("CANCELLED", "Cancelled"),     # user backed out / expired
    ]
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="HELD",                 # when you first create a booking, it's a hold
    )
    hold_expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user.username}"

    @property
    def is_active_hold(self):
        """True if this booking is a still-valid temporary hold"""
        return (
            self.status == "HELD"
            and self.hold_expires_at is not None
            and self.hold_expires_at > timezone.now()
        )

class Ticket(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='tickets')
    ticket_type = models.ForeignKey(TicketType, on_delete=models.SET_NULL, null=True)
    seat = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"Ticket {self.id} - {self.booking.user.username} ({self.ticket_type})"
