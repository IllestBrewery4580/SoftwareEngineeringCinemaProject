
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, update_session_auth_hash, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .models import EmailOTP, BillingAddress, Account
from .utils import generate_otp
import json

# -------------------------------- Auth / Registration ----------------------------------

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

# --------------------------- New Address & Payment Views -----------------------
@csrf_exempt
@login_required
def add_address(request):
    if request.method == "POST":
        data = json.loads(request.body)
        address = BillingAddress.objects.create(
            user=request.user,
            street=data.get('street'),
            city=data.get('city'),
            state=data.get('state'),
            postal_code=data.get('postal_code'),
        )
        return JsonResponse({'message': 'Address added successfully', 'address_id': address.id})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@login_required
def add_payment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            address = BillingAddress.objects.get(id=data.get('address_id'), user=request.user)
        except BillingAddress.DoesNotExist:
            return JsonResponse({'error': 'Address not found'}, status=404)
        
        Account.objects.create(
            user=request.user,
            card_number=data.get('card_number'),
            expiry_date=data.get('expiry_date'),
            cvv=data.get('cvv'),
            billing_address=address
        )
        return JsonResponse({'message': 'Payment info added successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# ------------------------- Password Management ------------------------------

@csrf_exempt
@login_required
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')
        new_password2 = data.get('newPassword2')

        user = request.user
        if not user.check_password(old_password):
            return JsonResponse({'status': 'error', 'message': 'Old password is incorrect'})
        if new_password != new_password2:
            return JsonResponse({'status': 'error', 'message': 'New passwords do not match'})
        
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user) # Keep user logged in after password change
        return JsonResponse({'status': 'success', 'message': 'Password changed successfully'})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_password = data.get('newPassword')
        new_password2 = data.get('newPassword2')

        if new_password != new_password2:
            return JsonResponse({'status': 'error', 'message': 'Passwords do not match'})
        
        # Identify user via session or token
        user_id = request.session.get('reset_user_id')
        if not user_id:
            return JsonResponse({'status': 'error', 'message': 'No user found for password reset'})
        
        user = User.objects.get(id=user_id)
        user.set_password(new_password)
        user.save()
        return JsonResponse({'status': 'success', 'message': 'Password reset succesfully'})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


# -------------------------------------- Update Profile ----------------------------------------------------
@login_required
def get_profile(request):
    if request.method == 'GET':
        user = request.user
        profile_data = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': getattr(user, 'phone', ''), # if you store phone in a custom field
            'account_data': list(Account.objects.filter(user=user).values()) 
        }
        return JsonResponse(profile_data)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@login_required
def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        user.first_name = data.get('fname', user.first_name)
        user.last_name = data.get('lname', user.last_name)
        user.phone = data.get('phone', getattr(user, 'phone', ''))
        user.save()
        return JsonResponse({'message': 'Profile updated successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def verify_otp_pass(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        entered_otp = data.get('otp')
        user_id = request.session.get('user_id')
        if not user_id:
            return JsonResponse({'status':'error','message':'Session expired. Please register again.'})
        user = User.objects.get(id=user_id)
        otp_record = EmailOTP.objects.get(user=user)
        if otp_record.otp == entered_otp:
            otp_record.is_verified = True
            otp_record.save()
            user.is_active = True
            user.save()
            return JsonResponse({'status':'success','message':'Email verified sucesssfully!'})
        else:
            return JsonResponse({'status':'error','message':'Invalid OTP'})
    return JsonResponse({'status':'error','message':'Invalid request method'})

def logout_view(request):
    logout(request)
    response = JsonResponse({'message': 'Logged out seccessfully'})
    return response

@ensure_csrf_cookie
def getCSRFToken(request):
    csrfToken = get_token(request)
    return JsonResponse({'csrfToken': csrfToken})
