from django.db import models
from accounts.models import CustomUser, Account
from movie.models import MovieShow, Seat

class TicketType(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.name} - ${self.price}"

class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    show = models.ForeignKey(MovieShow, on_delete=models.CASCADE, related_name="bookings")
    card = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    no_of_tickets = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code = models.CharField(max_length=20, null=True, blank=True)
    booking_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user.username}"


class Ticket(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='booking_seats')
    ticket_type = models.ForeignKey(TicketType, on_delete=models.SET_NULL, null=True)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, max_length=10)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=10.00)

    class Meta:
        unique_together = ("seat", "booking")
        
    def __str__(self):
        return f"Ticket {self.id} - {self.booking.user.username} ({self.ticket_type})"
