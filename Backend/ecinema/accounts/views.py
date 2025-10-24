from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login
from .models import EmailOTP
from .utils import generate_otp

# Create your views here.

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
            return redirect('register')

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_active = False  # inactive until email verification
        user.save()

        otp = generate_otp()
        EmailOTP.objects.create(user=user, otp=otp)

        send_mail(
            'Your OTP Verification Code',
            f'Your OTP code is {otp}',
            'your_email@gmail.com',
            [email],
            fail_silently=False,
        )

        request.session['user_id'] = user.id
        messages.success(request, 'An OTP has been sent to your email.')
        return redirect('verify_otp')

    return render(request, 'accounts/register.html')


def verify_otp(request):
    if request.method == 'POST':
        entered_otp = request.POST['otp']
        user_id = request.session.get('user_id')

        if not user_id:
            messages.error(request, 'Session expired. Please register again.')
            return redirect('register')

        user = User.objects.get(id=user_id)
        otp_record = EmailOTP.objects.get(user=user)

        if otp_record.otp == entered_otp:
            otp_record.is_verified = True
            otp_record.save()
            user.is_active = True
            user.save()
            messages.success(request, 'Email verified successfully! You can now log in.')
            return redirect('login')
        else:
            messages.error(request, 'Invalid OTP. Please try again.')
            return redirect('verify_otp')

    return render(request, 'accounts/verify_otp.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('home')  # change to your home URL
            else:
                messages.error(request, 'Please verify your email first.')
        else:
            messages.error(request, 'Invalid credentials.')
    return render(request, 'accounts/login.html')
