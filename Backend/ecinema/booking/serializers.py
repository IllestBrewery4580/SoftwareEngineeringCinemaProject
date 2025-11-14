from rest_framework import serializers
from .models import Booking, Ticket
from movie.models import Seat, MovieShow

class BookingSeatSerializer(serializers.ModelSerializer):
    seat_id = serializers.PrimaryKeyRelatedField(
        queryset=Seat.objects.all(), source="seat", write_only=True
    )

    class Meta:
        model = Ticket
        fields = ["seat_id", "price"]

class BookingSerializer(serializers.ModelSerializer):
    seats = BookingSeatSerializer(many=True, write_only=True)
    show = serializers.PrimaryKeyRelatedField(queryset=MovieShow.objects.all())

    class Meta:
        model = Booking
        fields = ["id", "user", "show", "total_price", "no_of_tickets", "booking_time"]
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

    def create(self, validated_data):
        seats_data = validated_data.pop("seats")
        total = sum([float(s.get("price", 10.0)) for s in seats_data])
        booking = Booking.objects.create(total_price=total, **validated_data)
        for s in seats_data:
            Ticket.objects.create(booking=booking, **s)
        return booking
