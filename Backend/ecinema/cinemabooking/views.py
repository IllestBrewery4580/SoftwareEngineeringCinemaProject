from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Show, Seat, Booking
from .serializers import ShowSerializer, SeatSerializer, BookingSerializer

class ShowViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Show.objects.select_related("auditorium").all()
    serializer_class = ShowSerializer

    @action(detail=True, methods=["get"])
    def seats(self, request, pk=None):
        show = self.get_object()
        seats = Seat.objects.filter(auditorium=show.auditorium).order_by("row", "number")
        ser = SeatSerializer(seats, many=True, context={"show": show})
        return Response(ser.data)

class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Booking.objects.none()
    serializer_class = BookingSerializer
