from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from .models import EmailOTP, Account, BillingAddress
from .utils import generate_otp
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.http import JsonResponse
import json

# Create your views here.

def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('fname')
        email = data.get('email')
        password = data.get('password')
        fname = data.get('fname')
        lname = data.get('lname')

        User = get_user_model()
        if User.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'Email already exists. Please try again.'})

        user = User.objects.create_user(username=username, email=email, password=password, first_name=fname, last_name=lname)
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
        return JsonResponse({'status': 'success', 'message': 'An OTP has been sent to your email.'}, status=200)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def verify_otp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        entered_otp = data.get('otp')
        user_id = request.session.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'message': 'Session expired. Please register again.'}, status=400)

        User = get_user_model()
        user = User.objects.get(id=user_id)
        otp_record = EmailOTP.objects.get(user=user)

        if otp_record.otp == entered_otp:
            otp_record.is_verified = True
            otp_record.save()
            user.is_active = True
            user.save()
            return JsonResponse({'status': 'success', 'message': 'Email verified successfully! You can now log in.'}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid OTP. Please try again.'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')  # or email
        password = data.get('password')

        user = get_user_model()
        try:
            user_info = user.objects.get(email=email)
            username = user_info.username
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User does not exist!'})

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                request.session['user_id'] = user.id
                return JsonResponse({'status': 'success', 'message': 'Login successful'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Please verify your email first.'}, status=403)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials.'}, status=401)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

@login_required
def get_profile(request):
    user = request.user
    try:
        account = Account.objects.get(user=user)
        billing = BillingAddress.objects.get(card=account)
        account_data = {
            "card_no": account.card_no,
            "card_type": account.card_type,
            "expiration_date": account.expiration_date.strftime("%Y-%m"),
            "billing_address": {
                "address_line": billing.address_line,
                "city": billing.city,
                "state": billing.state,
                "zipcode": billing.zipcode,
                "country": billing.country,
            }
        }
    except (Account.DoesNotExist, BillingAddress.DoesNotExist):
        account_data = []

    profile_data = {
        'email': user.email,
        'password': user.password,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'account_data': account_data
    }

    return JsonResponse(profile_data)

def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = request.session.get('user_id')
        fname = data.get('fname')
        lname = data.get('lname')
        phone = data.get('phone')

        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
        
        user.first_name = fname
        user.last_name = lname
        user.phone = phone
        user.save()
        return JsonResponse({'status': 'success', 'message': 'Successfully updated profile!'}, status=200)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

@login_required
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        oldpassword = data.get('oldPassword')
        newpassword = data.get('newPassword')
        newpassword2 = data.get('newPassword2')
        user = request.user
        
        if not user.check_password(oldpassword):
            return JsonResponse({'status': 'error', 'message': 'Your current password is not correct! Re-enter and try again.'})
        
        if newpassword != newpassword2:
            return JsonResponse({'status': 'error', 'message': 'Password do not match! Re-enter and try again.'})
        
        user.set_password(newpassword)
        user.save()
        update_session_auth_hash(request, user)
        try:
            send_mail(
                'You changed your password',
                f'You have successfully changed your password.',
                'your_email@gmail.com',
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f'Email send failed: {e}')

        return JsonResponse({'status': 'success', 'message': 'You have successfully changed your password!'}, status=200)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def forgot_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            otp = generate_otp()
            EmailOTP.objects.create(user=user, otp=otp)

            send_mail(
                'Reset your password',
                f'Here\'s your otp code {otp}',
                'your_email@gmail.com',
                [email],
                fail_silently=False,
            )

            request.session['user_id'] = user.id
            return JsonResponse({'status': 'success', 'message': 'Email has been sent to your! Follow the instructions.'})
        return JsonResponse({'status': 'error', 'message': 'Email does not exist. Re-enter and try again.'})
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def verify_otp_pass(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        entered_otp = data.get('otp')
        user_id = request.session.get('user_id')
        
        if not user_id:
            return JsonResponse({'status': 'error', 'message': 'Session expired. Please register again.'}, status=400)
        
        user = User.objects.get(id=user_id)
        otp_record = EmailOTP.objects.get(user=user)

        if otp_record.otp == entered_otp:
            otp_record.is_verified = True
            otp_record.save()
            return JsonResponse({'status': 'success', 'message': 'Email verified successfully! You can now log in.'}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid OTP. Please try again.'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)


def new_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        newpassword = data.get('newPassword')
        newpassword2 = data.get('newPassword2')
        user_id = request.session.get('user_id')
        
        user = User.objects.get(id=user_id)

        if newpassword != newpassword2:
            return JsonResponse({'status': 'error', 'message': 'Password do not match! Re-enter and try again.'})

        user.set_password(newpassword)
        user.save()
        update_session_auth_hash(request, user)
        try:
            send_mail(
                'You changed your password',
                f'You have successfully changed your password.',
                'your_email@gmail.com',
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f'Email send failed: {e}')

        return JsonResponse({'status': 'success', 'message': 'You have successfully changed your password!'}, status=200)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def logout_view(request):
    logout(request)
    response = JsonResponse({'message': 'Logged out seccessfully'})
    return response

@ensure_csrf_cookie
def getCSRFToken(request):
    csrfToken = get_token(request)
    return JsonResponse({'csrfToken': csrfToken})
