from datetime import datetime
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, update_session_auth_hash, logout
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .models import EmailOTP, BillingAddress, Account, UserType, HomeAddress
from .utils import generate_otp
import json

User = get_user_model()

def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('email')
        email = data.get('email')
        password = data.get('password')
        fname = data.get('fname')
        lname = data.get('lname')
        phone = data.get('phone')
        enroll_for_promotions = data.get('enroll_for_promotions')
        home_address = data.get('homeAddress')

        if User.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'Email already exists. Please try again.'})
        
        user = User.objects.create_user(
            username=username, 
            email=email, 
            password=password, 
            first_name=fname, 
            last_name=lname, 
            phone=phone, 
            enroll_for_promotions=enroll_for_promotions,)
        
        HomeAddress.objects.create(
            user=user,
            address_line= home_address.get('address_line', ''),
            city= home_address.get('city', ''),
            state= home_address.get('state', ''),
            zipcode= home_address.get('zipcode', ''),
            country= home_address.get('country', 'USA')
        )

        user.is_active = False  # inactive until email verification
        user.user_type = UserType.objects.get(name='Customer')
        user.save()

        otp = generate_otp()
        EmailOTP.objects.create(user=user, otp=otp)

        try:
            send_mail(
            'Your OTP Verification Code',
            f'Your OTP code is {otp}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        except Exception as e:
            print(f"Email send failed: {e}")

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

        try:
            if User.objects.filter(email=email).exists():
                user_info = User.objects.get(email=email)
            else:
                return JsonResponse({'status': 'error', 'message': 'Email does not exist.'}, status=401)
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
            return JsonResponse({'status': 'error', 'message': 'Invalid password.'}, status=401)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def admin_login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')  # or email
        password = data.get('password')

        try:
            user_info = User.objects.get(email=email)
            username = user_info.username
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User does not exist!'})

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_active:
                if user.user_type.name == 'Admin':
                    login(request, user)
                    request.session['user_id'] = user.id
                    return JsonResponse({'status': 'success', 'message': 'Login successful'})
                return JsonResponse({'status': 'error', 'message': 'Not an admin!'}, status=403)
            else:
                return JsonResponse({'status': 'error', 'message': 'Please verify your email first.'}, status=403)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials.'}, status=401)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed.'}, status=405)

def isAuth(request):
    if request.user.is_authenticated:
        if request.user.user_type.name == 'Admin':
            return JsonResponse({'status': 'success', 'message': 'User is logged in!', 'isAuth': 'Admin'}, status=200)
        
        return JsonResponse({'status': 'success', 'message': 'User is logged in!', 'isAuth': 'Customer'}, status=200)

    return JsonResponse({'status': 'error', 'message': 'User is not logged in!'})

def get_users(request):
    if request.user.is_authenticated:
        if request.user.user_type.name == 'Admin':
            allUsers = list(User.objects.all().values(
                'email', 'first_name', 'last_name', 'user_type__name', 'is_active',
            ))
            return JsonResponse(allUsers, safe=False)
        
        return JsonResponse({'status': 'error', 'message': 'User is not an admin.'})
    return JsonResponse({'status': 'error', 'message': 'User is not logged in!'})

@login_required
def get_profile(request):
    user = request.user
    user_id = request.user.id

    try:
        home_address = HomeAddress.objects.get(user=user_id)
    except HomeAddress.DoesNotExist:
        home_address = None
    
    accounts = []
    for acc in Account.objects.filter(user=user):
        try:
            addr = BillingAddress.objects.get(card=acc)
        except BillingAddress.DoesNotExist:
            addr = None

        accounts.append({
            "card_no": acc.get_card_no(),
            "card_type": acc.card_type,
            "expiration_date": acc.expiration_date.strftime("%m/%Y"),
            "card_cvv": acc.get_cvv(),
            "address_line": addr.address_line if addr else "",
            "city": addr.city if addr else "",
            "state": addr.state if addr else "",
            "zipcode": addr.zipcode if addr else "",
            "country": addr.country if addr else ""
        })

    profile_data = {
        'email': user.email,
        'password': user.password,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'enroll_for_promotions': user.enroll_for_promotions,
        'account_data': accounts,
        'home_address': {
            "address_line": home_address.address_line if home_address else "",
            "city": home_address.city if home_address else "",
            "state": home_address.state if home_address else "",
            "zipcode": home_address.zipcode if home_address else "",
            "country": home_address.country if home_address else "",
        }
    }

    return JsonResponse(profile_data)

def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        fname = data.get('fname')
        lname = data.get('lname')
        phone = data.get('phone')
        enroll_for_promotions = data.get('enroll_for_promotions')
        home_address = data.get('homeAddress', [])
        payment_data = data.get('payment', [])

        for pay in payment_data:
            # Create or update the Account entry
            acc, created = Account.objects.get_or_create(
                user=user,
                card_type=pay['cardType'],
            )

            # Use the model’s encryption methods
            acc.set_card_no(pay['cardNum'])
            acc.set_cvv(pay['cardCVV'])
            acc.expiration_date = datetime.strptime(pay['cardExp'], "%m/%Y").date()
            acc.save()

            # Update or create billing address
            BillingAddress.objects.update_or_create(
                card=acc,
                defaults={
                    'user': acc.user,
                    'address_line': pay.get('address_line', ''),
                    'city': pay.get('city', ''),
                    'state': pay.get('state', ''),
                    'zipcode': pay.get('zipcode', ''),
                    'country': pay.get('country', 'USA'),
                }
            )

        if home_address:
            HomeAddress.objects.update_or_create(
                user=user,
                defaults={
                        'address_line': home_address.get('address_line', ''),
                        'city': home_address.get('city', ''),
                        'state': home_address.get('state', ''),
                        'zipcode': home_address.get('zipcode', ''),
                        'country': home_address.get('country', 'USA')
                    }
            )

        user.first_name = fname
        user.last_name = lname
        user.phone = phone
        user.enroll_for_promotions = enroll_for_promotions
        user.accounts_data = payment_data
        user.home_address = home_address
        user.save()

        try:
            send_mail(
                'You changed your password',
                f'You have successfully changed your profile.',
                'your_email@gmail.com',
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f'Email send failed: {e}')

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
            EmailOTP.objects.update_or_create(
                user=user, 
                defaults={'otp': otp, 'is_verified': False}
            )

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
            return JsonResponse({'status': 'success', 'message': 'Email verified successfully! You can now reset your password.'}, status=200)
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

@csrf_exempt
@login_required
def add_address(request):
    if request.method == "POST":
        data = json.loads(request.body)
        address = BillingAddress.objects.create(
            user=request.user,
            address_line=data.get('address_line', ''),
            city=data.get('city'),
            state=data.get('state'),
            zipcode=data.get('zipcode', ''),
            country=data.get('country')
        )
        return JsonResponse({'message': 'Address added successfully', 'address_id': address.id})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@login_required
def add_payment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        methods = data.get('methods', [])

        # Create Account Entry
        for method in methods:
            try:
                account = Account.objects.create(
                    user=request.user,
                    card_type=method.get('cardType'),
                    expiration_date=datetime.strptime(method.get('cardExp'), "%m/%Y").date(),
                )
                address = BillingAddress.objects.create(
                    user=request.user,
                    address_line=method.get('address_line', ''),
                    city=method.get('city'),
                    state=method.get('state'),
                    zipcode=method.get('zipcode', ''),
                    country=method.get('country', 'USA')
                )
                
                account.set_card_no(method.get('cardNum')) # use model encryption method
                account.set_cvv(method.get('cardCVV')) # encrypt cvv
                account.save()

                # Link BillingAddress
                address.card = account
                address.save()
            except Exception as e:
                # Rollback account if address creatoion fails
                if 'account' in locals():
                    account.delete()
                return JsonResponse({'error': str(e)}, status=400)
    
        return JsonResponse({'status': 'success', 'message': 'Payment info added successfully'})

@login_required
@require_http_methods(["DELETE"])
def delete_payment(request, id):
    account = get_object_or_404(Account, card_no=id, user=request.user)
    BillingAddress.objects.filter(card=account).delete()
    account.delete()

    return JsonResponse({'status': 'success', 'message': 'Payment method deleted successfully!'})