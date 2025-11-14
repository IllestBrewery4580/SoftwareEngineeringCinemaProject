from django.contrib import admin

# Register your models here.
from .models import Ticket, Booking, TicketType

admin.site.register(Ticket)
admin.site.register(Booking)
admin.site.register(TicketType)