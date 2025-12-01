from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('getUserBooking/', views.getUserBooking, name='getUserBooking'),  
    path('shows/<int:show_id>/hold/', views.hold_seats, name="hold-seats"),
    path('shows/<int:show_id>/seats/<int:seat_id>/release/', views.release_seat, name='release_seat'),
    path('<int:booking_id>/confirm', views.confirm_booking, name="confirm-booking"),
]