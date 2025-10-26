from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.get_profile, name='get_profile'),
    path('updateprofile/', views.update_profile, name='update_profile'),
    path('csrf/', views.getCSRFToken, name='getCSRFToken'),
    path('forgotpassword/', views.forgot_password, name='forgot_password'),
    path('newpassword/', views.new_password, name='new_password'),
    path('verify-otp-pass/', views.verify_otp_pass, name='verify_otp_pass'),
    path('changepassword/', views.change_password, name='change_password'),
]
