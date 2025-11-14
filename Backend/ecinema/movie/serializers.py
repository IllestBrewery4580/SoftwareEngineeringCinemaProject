from rest_framework import serializers
from .models import Movie, MovieShow, Seat
from booking.models import Ticket

class MovieShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieShow
        fields = ['id', 'show_start_time', 'auditorium', 'no_of_available_seats', 'movie']

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
            local_time = show.show_start_time
            formatted_time = local_time.strftime("%a, %b %d • %I:%M %p")
            formatted.append({
                'id': show.id,
                'label': formatted_time,
                'auditorium': show.auditorium.id})
        return formatted

class SeatSerializer(serializers.ModelSerializer):
    is_reserved = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ["id", "row_number", "seat_number", "is_reserved", 'auditorium']

    def get_is_reserved(self, obj):
        show = self.context.get("show")
        if not show:
            return False
        return Ticket.objects.filter(booking__show=show, seat=obj).exists()

class ShowSerializer(serializers.ModelSerializer):
    auditorium = serializers.StringRelatedField()

    class Meta:
        model = MovieShow
        fields = ["id", "movie", "show_start_time", "auditorium"]