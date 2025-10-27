from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('register/', views.register, name='register'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('csrf/', views.getCSRFToken, name='getCSRFToken'),

    # Password routes
    path('forgotpassword/', views.forgot_password, name='forgot_password'),
    path('changepassword/', views.change_password, name='change_password'),
    path('newpassword/', views.reset_password, name='reset_password'),
    path('verify-otp-pass/', views.verify_otp_pass, name='verify_otp_pass'),

    # Profile routes
    path('profile/', views.get_profile, name='get_profile'),
    path('updateprofile/', views.update_profile, name='update_profile'),

    # Address & Payment
    path('add_address/', views.add_address, name='add_address'),
    path('add_payment/', views.add_payment, name='add_payment'),
]
