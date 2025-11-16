from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

def send_promotion_email(promotion):
    User = get_user_model()
    subscribed_users = list(
        User.objects.filter(is_subscribed=True).values_list("email", flat=True)
    )

    if not subscribed_users:
        return
    
    send_email = "simplymovies4050@gmail.com"
    
    # EXACT TEMPLATE:
    #
    # New Promotion: ABC123
    #
    # simplymovies4050@gmail.com
    # to user1@gmail.com, user2@gmail.com
    #
    # Enjoy 30.00% OFF!
    #
    # Valid from 2025-11-25 to 2025-12-25
    subject = f"New Promotion: {promotion.code}"

    # Format EXACTLY like the required template
    message = (
        f"New Promotion: {promotion.code}\n\n"
        f"{sender_email}\n"
        f"to {', '.join(subscribed_users)}\n\n"
        f"Enjoy {float(promotion.discount_percent)}% OFF!\n\n"
        f"Valid from {promotion.start_date} to {promotion.end_date}"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        subscribed_users,
        fail_silently=False,
    )
