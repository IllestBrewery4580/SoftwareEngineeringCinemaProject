from django.urls import path
from Logout.views import logout_view  # absolute import since it's a separate app

urlpatterns = [
    path('logout/', logout_view, name='logout'),
]