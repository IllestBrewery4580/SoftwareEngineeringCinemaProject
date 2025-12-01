from rest_framework import serializers
from .models import Booking, Ticket
from movie.models import Seat, MovieShow

class BookingSeatSerializer(serializers.ModelSerializer):
    seat_id = serializers.PrimaryKeyRelatedField(
        queryset=Seat.objects.all(), source="seat", write_only=True
    )
    ticket_type = serializers.CharField(write_only=True)

    class Meta:
        model = Ticket
        fields = ["seat_id", "price", "ticket_type"]

class BookingSerializer(serializers.ModelSerializer):
    seats = BookingSeatSerializer(many=True, write_only=True)
    show = serializers.PrimaryKeyRelatedField(queryset=MovieShow.objects.all())
    card4 = serializers.StringRelatedField()

    class Meta:
        model = Booking
        fields = ["id", "user", "show", "seats", "card", "total_price", "no_of_tickets", "booking_time", "card4"]
        read_only_fields = ["id", "total_price", "booking_time"]

    def validate(self, data):
        show = data["show"]
        seat_objs = [s["seat"] for s in data["seats"]]
        for s in seat_objs:
            if s.auditorium_id != show.auditorium_id:
                raise serializers.ValidationError(f"Seat {s} not in the show's auditorium.")
            if Ticket.objects.filter(booking__show=show, seat=s).exists():
                raise serializers.ValidationError(f"Seat {s} already reserved.")
        return data