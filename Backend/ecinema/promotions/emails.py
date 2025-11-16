from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

def send_promotion_email(promotion):
    User = get_user_model()
    subscribed_users = User.objects.filter(is_subscribed=True).values_list("email", flat=True)

    subject = f"New Promotion: {promotion.code}"
    message = (
        f"We're xcited to announce a new promotion!\n\n"
        f"Code: {promotion.code}\n"
        f"Discount: {promotion.discount_percent}% off\n"
        f"Valid: {promotion.start_date} to {promotion.end_date}\n\n"
        f"{promotion.description}\n"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        subscribed_users,
        fail_silently=False,
    )
