from rest_framework import serializers
from .models import Movie, MovieShow, Seat
from booking.models import Ticket
from django.utils.timezone import localtime
from django.utils import timezone
from django.db import models

class MovieShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieShow
        fields = ['id', 'show_start_time', 'auditorium', 'no_of_available_seats', 'movie']

    def validate(self, data):
        auditorium = data.get("auditorium")
        show_start_time = data.get("show_start_time")

        movie = MovieShow.objects.filter(
            auditorium=auditorium,
            show_start_time=show_start_time,
        )

        if self.instance:
            movie = movie.exclude(id=self.instance.id)

        if movie.exists():
            raise serializers.ValidationError(
                {"detail": "A showtime for this movie, auditorium, and datetime already exists."}
            )
        return data

class MovieSerializer(serializers.ModelSerializer):
    showtimes = serializers.SerializerMethodField()
    showtimes_raw = MovieShowSerializer(source='movieshow_set', many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

    def get_showtimes(self, obj):
        shows = MovieShow.objects.filter(movie=obj).order_by('show_start_time')
        formatted = []
        for show in shows:
            local_time = localtime(show.show_start_time)
            formatted_time = local_time.strftime("%a, %b %d • %I:%M %p")
            formatted.append({
                'id': show.id,
                'label': formatted_time,
                'auditorium': show.auditorium.id})
        return formatted

class SeatSerializer(serializers.ModelSerializer):
    is_reserved = serializers.SerializerMethodField()
    held_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ["id", "row_number", "seat_number", "is_reserved", 'held_by_me', 'auditorium']

    def get_is_reserved(self, obj):
        show = self.context.get("show")
        if not show:
            return False
        now = timezone.now()
        
        return Ticket.objects.filter(booking__show=show, seat=obj
        ).filter(
            models.Q(booking__status="CONFIRMED") |
            models.Q(booking__status="HELD", booking__hold_expires_at__gt=now)
        ).exists()

    def get_held_by_me(self, obj):
        show = self.context.get("show")
        user = self.context["request"].user
        if not show or not user.is_authenticated:
            return False
        
        now = timezone.now()
        return Ticket.objects.filter(
            seat=obj,
            booking__show_id=show.id,
            booking__user=user,
            booking__status="HELD",
            booking__hold_expires_at__gt=now,
        ).exists()
    
class ShowSerializer(serializers.ModelSerializer):
    auditorium = serializers.StringRelatedField()

    class Meta:
        model = MovieShow
        fields = ["id", "movie", "show_start_time", "auditorium"]