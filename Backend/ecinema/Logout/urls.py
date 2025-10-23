from django.urls import path
<<<<<<< HEAD
from Logout.views import logout_view  # absolute import since it's a separate app

urlpatterns = [
    path('logout/', logout_view, name='logout'),
=======
from .views import logout_view

urlpatterns = [
    path('accounts/logout', logout_view, name='logout'),
>>>>>>> e9077dd (Added logout button and updated App.js UI)
]