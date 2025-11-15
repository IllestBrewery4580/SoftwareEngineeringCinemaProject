from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.core.mail import send_mail
from django.conf import settings

from .forms import PromotionForm
from .models import Promotion
from accounts.models import CustomUser


@staff_member_required
def create_promotion(request):
    if request.method == "POST":
        form = PromotionForm(request.POST)
        if form.is_valid():
            promo = form.save()
            messages.success(request, "Promotion created successfully!")
            return redirect("promotion_list")
        else:
            messages.error(request, "Please fix the errors.")
    else:
        form = PromotionForm()

    return render(request, "promotions/create_promotion.html", {"form": form})


@staff_member_required
def promotion_list(request):
    promotions = Promotion.objects.all().order_by("-start_date")
    return render(request, "promotions/promotion_list.html", {"promotions": promotions})


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
