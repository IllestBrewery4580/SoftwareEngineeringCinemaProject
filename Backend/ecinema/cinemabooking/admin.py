from django.contrib import admin
from .models import Auditorium, Show, Seat, Booking, BookingSeat
admin.site.register([Auditorium, Show, Seat, Booking, BookingSeat])

