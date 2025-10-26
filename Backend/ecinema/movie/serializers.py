from rest_framework import serializers
from .models import Movie, MovieShow

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    showtimes = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = '__all__'

    def get_showtimes(self, obj):
        shows = MovieShow.objects.filter(movie=obj).order_by('show_start_time')
        formatted = []
        for show in shows:
            local_time = show.show_start_time
            formatted_time = local_time.strftime("%a, %b %d • %I:%M %p")
            formatted.append(formatted_time)
        return formatted
