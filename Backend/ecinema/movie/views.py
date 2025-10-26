from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Movie, MovieShow
from .serializers import MovieSerializer
from .serializers import MovieShowSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class MovieShowViewSet(viewsets.ModelViewSet):
    queryset = MovieShow.objects.all()
    serializer_class = MovieShowSerializer
