from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Promotion
from .emails import send_promotion_email

@receiver(post_save, sender=Promotion)
def send_email_on_promotion_save(sender, instance, created, **kwargs):
    if created:
        send_promotion_email(instance)
