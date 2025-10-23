<<<<<<< HEAD
from django.contrib.auth import logout
from django.http import JsonResponse

def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out seccessfully'})
=======
# views.py
from django.contrib.auth import logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt # if using API calls from React frontend
def logout_view(request):
    if request.method == 'GET':
        logout(request)  # ends the session
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
>>>>>>> e9077dd (Added logout button and updated App.js UI)
