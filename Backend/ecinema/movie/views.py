from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Movie
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Movie, MovieShow, Seat
from .serializers import MovieSerializer, MovieShowSerializer, ShowSerializer, SeatSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    @action(detail=True, methods=['POST'])
    def update_movie(self, request, pk=None):
        movie = self.get_object()
        data = request.data

        movie.title = data.get('title', movie.title)
        movie.description = data.get('description', movie.description)
        movie.cast = data.get('cast', movie.cast)
        movie.genre = data.get('genre', movie.genre)
        movie.producer = data.get('producer', movie.producer)
        movie.duration = data.get('duration', movie.duration)
        movie.trailer_link = data.get('trailer_link', movie.trailer_link)
        movie.rating_id = data.get('rating', movie.rating_id)
        movie.review_score = data.get('review_score', movie.review_score)

        if 'poster' in request.FILES:
            movie.poster = request.FILES['poster']

        movie.save()
        serializer = MovieSerializer(movie)
        return Response({
            'status': 'success',
            'message': 'Movie updated successfully!',
            'movie': serializer.data
        }, status=status.HTTP_200_OK)

class MovieShowViewSet(viewsets.ModelViewSet):
    queryset = MovieShow.objects.all()
    serializer_class = MovieShowSerializer

    @action(detail=True, methods=['POST'])
    def update_showtimes(self, request, pk=None):
        movie = get_object_or_404(Movie, pk=pk)
        data = request.data.get('showtimes', [])
        updated = []

        for show_data in data:
            show_id = show_data.get('id')
            if show_id:
                show = get_object_or_404(MovieShow, id=show_id)
                serializer = MovieShowSerializer(show, data=show_data, partial=True)
            else:
                show_data['movie'] = movie.id
                serializer = MovieShowSerializer(data=show_data)
            
            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        shows = MovieShow.objects.filter(movie=movie).order_by('show_start_time')
        serializer = MovieShowSerializer(shows, many=True)

        return Response({
            'status': 'success',
            'message': 'Showtimes updated successfully!',
            'updated_showtimes': serializer.data
        }, status=status.HTTP_200_OK)
    
class ShowViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MovieShow.objects.select_related("auditorium").all()
    serializer_class = ShowSerializer

    @action(detail=True, methods=["get"])
    def seats(self, request, pk=None):
        show = self.get_object()
        seats = Seat.objects.filter(auditorium=show.auditorium).order_by("row_number", "seat_number")
        ser = SeatSerializer(seats, many=True, context={"show": show})
        return Response(ser.data)