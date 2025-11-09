from django.db import models
from django.utils import timezone

class Auditorium(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Show(models.Model):
    movie_title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    auditorium = models.ForeignKey(Auditorium, on_delete=models.CASCADE, related_name="shows")

    def __str__(self):
        return f"{self.movie_title} @ {self.start_time:%Y-%m-%d %H:%M} ({self.auditorium})"

class Seat(models.Model):
    auditorium = models.ForeignKey(Auditorium, on_delete=models.CASCADE, related_name="seats")
    row = models.CharField(max_length=5)
    number = models.PositiveIntegerField()

    class Meta:
        unique_together = ("auditorium", "row", "number")

    def __str__(self):
        return f"{self.row}{self.number}"

class Booking(models.Model):
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name="bookings")
    full_name = models.CharField(max_length=120, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return f"Booking #{self.id} for {self.show}"

class BookingSeat(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="booking_seats")
    seat = models.ForeignKey(Seat, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=10.00)

    class Meta:
        unique_together = ("seat", "booking")
