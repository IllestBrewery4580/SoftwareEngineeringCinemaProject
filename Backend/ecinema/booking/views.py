from rest_framework import viewsets, mixins
from .models import Booking
from .serializers import BookingSerializer

# Create your views here.
class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Booking.objects.none()
    serializer_class = BookingSerializer