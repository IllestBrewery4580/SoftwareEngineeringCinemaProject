from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
import json

from .forms import PromotionForm
from .models import Promotion
from accounts.models import CustomUser

@staff_member_required
def create_promotion(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = PromotionForm(data)
        if form.is_valid():
            promo = form.save()
            messages.success(request, "Promotion created successfully!")
            return redirect("promotion_list")
        else:
            messages.error(request, "Please fix the errors.")
    else:
        form = PromotionForm()

    return render(request, "promotions/create_promotion.html", {"form": form})

def promotion_list(request):
    promotions = Promotion.objects.all().order_by("-start_date")
    promo_list = list(promotions.values())
    return JsonResponse({'status': 'success', 'promotions': promo_list})

def validate_promo(request, promo_code):
    if not promo_code.strip():
        return JsonResponse({
            'status': 'success',
            'promotion': None,
            'message': 'No promo code applied.'
        })
    try:
        promo = Promotion.objects.get(promo_code=promo_code)
        return JsonResponse({
            'status': 'success',
            'promotion': {
                'promo_code': promo.promo_code,
                'discount': str(promo.discount_percent),
                'start_date': promo.start_date,
                'end_date': promo.end_date,
                'description': promo.description,
            }
        })
    except Promotion.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid promotion code.'
        }, status=404)

@staff_member_required
def email_promotion(request, promo_id):
    promo = get_object_or_404(Promotion, id=promo_id)

    subscribed_users = CustomUser.objects.filter(enroll_for_promotions=True)
    email_list = [u.email for u in subscribed_users if u.email]

    if not email_list:
        messages.warning(request, "No subscribed users.")
        return redirect("promotion_list")

    subject = f"New Promotion: {promo.promo_code}"
    message = (
        f"Enjoy {promo.discount_percent}% off!\n\n"
        f"Valid: {promo.start_date} → {promo.end_date}\n\n"
        f"{promo.description}"
    )

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, email_list)

    messages.success(request, f"Promotion emailed to {len(email_list)} users.")
    return redirect("promotion_list")
