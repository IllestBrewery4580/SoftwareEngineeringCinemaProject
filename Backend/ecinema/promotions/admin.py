from django.contrib import admin
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages

from .models import Promotion
from accounts.models import CustomUser


def send_promotion_email(modeladmin, request, queryset):
    """
    Admin Action: Send promo email for each selected Promotion.
    """
    subscribers = CustomUser.objects.filter(enroll_for_promotions=True)
    emails = [u.email for u in subscribers if u.email]

    if not emails:
        messages.warning(request, "No subscribed users to send emails to.")
        return

    for promo in queryset:
        subject = f"New Promotion: {promo.promo_code}"
        message = (
            f"Enjoy {promo.discount_percent}% OFF!\n\n"
            f"Valid from {promo.start_date} to {promo.end_date}\n"
            f"{promo.description}"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, emails)

    messages.success(request, f"Email sent for {queryset.count()} promotion(s).")


send_promotion_email.short_description = "Send promotion email to subscribed users"


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("promo_code", "discount_percent", "start_date", "end_date")
    search_fields = ("promo_code",)
    actions = [send_promotion_email]   # ⬅ ADD ADMIN ACTION
