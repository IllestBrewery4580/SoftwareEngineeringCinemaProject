from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from cryptography.fernet import Fernet
import base64
import os

fernet = Fernet(settings.ENCRYPTION_KEY)

class UserType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, null=True, blank=True)
    status = models.CharField(max_length=20, default='inactive')
    enroll_for_promotions = models.BooleanField(default=False)
    user_type = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.username


class EmailOTP(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.otp}"

class Account(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    card_no_encrypted = models.BinaryField()
    card_type = models.CharField(max_length=20)
    expiration_date = models.DateField()
    cvv_encrypted = models.BinaryField()

    def set_card_no(self, card_no):
        self.card_no_encrypted = fernet.encrypt(card_no.encode())

    def get_card_no(self):
        return fernet.decrypt(self.card_no_encrypted).decode()
    
    def get_last4(self):
        return self.get_card_no()[-4:]

    def set_cvv(self, cvv):
        self.cvv_encrypted = fernet.encrypt(cvv.encode())

    def get_cvv(self):
        return fernet.decrypt(self.cvv_encrypted).decode()

    def __str__(self):
        return f"{self.user.username} - {self.card_type}"
    
class HomeAddress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} - {self.address_line}"


class BillingAddress(models.Model):
    card = models.OneToOneField(Account, on_delete=models.CASCADE)
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"Billing for {self.card.user.username}"