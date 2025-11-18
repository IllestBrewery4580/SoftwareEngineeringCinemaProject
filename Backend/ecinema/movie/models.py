from django.db import models

class USRating(models.Model):
    rating_code = models.CharField(max_length=10)

    def __str__(self):
        return self.rating_code


class Movie(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    cast = models.TextField()
    genre = models.CharField(max_length=50)
    producer = models.CharField(max_length=100)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    trailer_link = models.URLField()
    poster = models.ImageField(upload_to='posters/')
    rating = models.ForeignKey(USRating, on_delete=models.SET_NULL, null=True)
    review_score = models.FloatField(default=0.0)

    def __str__(self):
        return self.title


class Auditorium(models.Model):
    name = models.CharField(max_length=50)
    no_of_seats = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Seat(models.Model):
    auditorium = models.ForeignKey(Auditorium, on_delete=models.CASCADE, related_name="seats")
    row_number = models.CharField(max_length=5)
    seat_number = models.PositiveIntegerField()

    class Meta:
        unique_together = ("auditorium", "row_number", "seat_number")

    def __str__(self):
        return f"{self.auditorium.name} - {self.row_number}{self.seat_number}"


class MovieShow(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    auditorium = models.ForeignKey(Auditorium, on_delete=models.CASCADE, related_name="shows")
    show_start_time = models.DateTimeField()
    no_of_available_seats = models.PositiveIntegerField()

    class Meta:
        unique_together = ('movie', 'auditorium', 'show_start_time')

    def __str__(self):
        return f"{self.movie.title} @ {self.show_start_time}"
