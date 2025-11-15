from rest_framework import serializers
from .models import Booking, Ticket, TicketType
from movie.models import Seat, MovieShow
from .factories import TicketFactory

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

    class Meta:
        model = Booking
        fields = ["id", "user", "show", "seats", "total_price", "no_of_tickets", "booking_time"]
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
        validated_data["total_price"] = 0.00    
        booking = Booking.objects.create(**validated_data)
        
        total_price = 0.00
        for s in seats_data:
            seat = s["seat"]
            ticket_type = TicketType.objects.get(name=s["ticket_type"])

            factory = TicketFactory.create(ticket_type)
            price = factory.get_price()

            Ticket.objects.create(
                booking=booking,
                seat=seat,
                ticket_type=ticket_type,
                price=price
            )

            total_price += price

        booking.total_price = total_price
        booking.save()
        return booking