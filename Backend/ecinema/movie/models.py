from django.db import models

# Create your models here.

class Movie(models.Model):
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=300)
    rating = models.FloatField()
    description = models.TextField()
    release_date = models.DateField()
    showtimes = models.JSONField(default=list)   # requires PostgreSQL or Django 3.1+
    poster = models.CharField(max_length=200)   # e.g. "/theLionKing.jpeg"
    trailer = models.URLField()
    duration = models.CharField(max_length=50)
    status = models.CharField(max_length=100)

    def __str__(self):
        return self.title
