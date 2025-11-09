from rest_framework import serializers
from .models import Auditorium, Show, Seat, Booking, BookingSeat

class SeatSerializer(serializers.ModelSerializer):
    is_reserved = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ["id", "row", "number", "is_reserved"]

    def get_is_reserved(self, obj):
        show = self.context.get("show")
        if not show:
            return False
        return BookingSeat.objects.filter(booking__show=show, seat=obj).exists()

class ShowSerializer(serializers.ModelSerializer):
    auditorium = serializers.StringRelatedField()

    class Meta:
        model = Show
        fields = ["id", "movie_title", "start_time", "auditorium"]

class BookingSeatSerializer(serializers.ModelSerializer):
    seat_id = serializers.PrimaryKeyRelatedField(
        queryset=Seat.objects.all(), source="seat", write_only=True
    )

    class Meta:
        model = BookingSeat
        fields = ["seat_id", "price"]

class BookingSerializer(serializers.ModelSerializer):
    seats = BookingSeatSerializer(many=True, write_only=True)
    show = serializers.PrimaryKeyRelatedField(queryset=Show.objects.all())

    class Meta:
        model = Booking
        fields = ["id", "show", "full_name", "email", "total_price", "seats", "created_at"]
        read_only_fields = ["id", "total_price", "created_at"]

    def validate(self, data):
        show = data["show"]
        seat_objs = [s["seat"] for s in data["seats"]]
        for s in seat_objs:
            if s.auditorium_id != show.auditorium_id:
                raise serializers.ValidationError(f"Seat {s} not in the show's auditorium.")
            if BookingSeat.objects.filter(booking__show=show, seat=s).exists():
                raise serializers.ValidationError(f"Seat {s} already reserved.")
        return data

    def create(self, validated_data):
        seats_data = validated_data.pop("seats")
        total = sum([float(s.get("price", 10.0)) for s in seats_data])
        booking = Booking.objects.create(total_price=total, **validated_data)
        for s in seats_data:
            BookingSeat.objects.create(booking=booking, **s)
        return booking
