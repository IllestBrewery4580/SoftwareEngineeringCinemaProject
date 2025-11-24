from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('register/', views.register, name='register'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_view, name='login'),
    path('adminlogin/', views.admin_login_view, name='admin_login'),
    path('logout/', views.logout_view, name='logout'),
    path('isAuth/', views.isAuth, name='isAuth'),
    path('getUsers/', views.get_users, name='get_users'),
    path('csrf/', views.getCSRFToken, name='getCSRFToken'),

    # Password routes
    path('forgotpassword/', views.forgot_password, name='forgot_password'),
    path('changepassword/', views.change_password, name='change_password'),
    path('newpassword/', views.new_password, name='new_password'),
    path('verify-otp-pass/', views.verify_otp_pass, name='verify_otp_pass'),

    # Profile routes
    path('profile/', views.get_profile, name='get_profile'),
    path('updateprofile/', views.update_profile, name='update_profile'),

    # Payment
    path('add_payment/', views.add_payment, name='add_payment'),
    path('payment/<str:id>/', views.delete_payment, name='delete_payment')
]
