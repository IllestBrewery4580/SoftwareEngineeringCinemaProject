from django.contrib.auth import logout
from django.http import JsonResponse

def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out seccessfully'})