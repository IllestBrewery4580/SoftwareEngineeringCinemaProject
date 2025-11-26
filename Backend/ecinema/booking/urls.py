from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    BookingViewSet,
    getUser,
    get_show_seats,
    hold_seats,
    confirm_booking,
)

router = DefaultRouter()
router.register(r"bookings", BookingViewSet, basename="booking")

urlpatterns = [
    path("getUser/", getUser, name="getUser"),
    path("shows/<int:show_id>/seats/", get_show_seats, name="show-seats"),
    path("shows/<int:show_id>/hold/", hold_seats, name="hold-seats"),
    path("bookings/<int:booking_id>/confirm/", confirm_booking, name="confirm-booking"),
]

urlpatterns += router.urls
