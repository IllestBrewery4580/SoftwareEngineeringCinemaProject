from django.contrib import admin

# Register your models here.
from .models import Movie, Auditorium, MovieShow, Seat, USRating

admin.site.register(Movie)
admin.site.register(Auditorium)
admin.site.register(MovieShow)
