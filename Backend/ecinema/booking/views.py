from rest_framework import viewsets, mixins
from .models import Booking
from .serializers import BookingSerializer
from django.http import JsonResponse


# Create your views here.
class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

def getUser(request):
    if request.user.is_authenticated:
        user_data = {
            'username': request.user.username,
            'email': request.user.email,
            'id': request.user.id,
        }
        return JsonResponse({'status': 'success', 'message': 'User is logged in!', 'user': user_data}, status=200)
    return JsonResponse({'status': 'error', 'message': 'User is not logged in!'})