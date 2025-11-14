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
    card_no_encrypted = models.TextField()
    cvv_encrypted = models.TextField()
    # card_no_encrypted = models.BinaryField()
    card_type = models.CharField(max_length=20)
    # expiration_date = models.DateField()
    expiration_date = models.DateField(null=True, blank=True)
    # cvv_encrypted = models.BinaryField()

    # def set_card_no(self, card_no):
    #     self.card_no_encrypted = fernet.encrypt(card_no.encode())
        # self.card_no_encrypted = card_no
        
    def set_card_no(self, card_no):
            encrypted_bytes = fernet.encrypt(card_no.encode())
            self.card_no_encrypted = base64.urlsafe_b64encode(encrypted_bytes).decode()

    # def get_card_no(self):
    #     # encrypted_bytes = bytes(self.card_no_encrypted)
    #     # encrypted_bytes = self.card_no_encrypted.tobytes()
    #     # return fernet.decrypt(encrypted_bytes).decode()
    #     # return fernet.decrypt(self.card_no_encrypted).decode()
    #     # return self.card_no_encrypted
    #     encrypted_bytes = base64.urlsafe_b64decode(self.card_no_encrypted.encode())
    #     return fernet.decrypt(encrypted_bytes).decode()
    
    def get_last4(self):
        return self.get_card_no()[-4:]

    def set_cvv(self, cvv):
        encrypted_bytes = fernet.encrypt(cvv.encode())
        self.cvv_encrypted = base64.urlsafe_b64encode(encrypted_bytes).decode()
        # self.cvv_encrypted = fernet.encrypt(cvv.encode())
        # self.cvv_encrypted = cvv

    # def get_cvv(self):
    #     # encrypted_bytes = bytes(self.cvv_encrypted)
    #     # encrypted_bytes = self.cvv_encrypted.tobytes()
    #     # return fernet.decrypt(encrypted_bytes).decode()
    #     # return fernet.decrypt(self.cvv_encrypted).decode()
    #     # return self.cvv_encrypted
    #     encrypted_bytes = base64.urlsafe_b64decode(self.cvv_encrypted.encode())
    #     return fernet.decrypt(encrypted_bytes).decode()
    
    
    def get_card_no(self):
        if not self.card_no_encrypted:
            return None
        try:
            # Only encode if it's a string
            data = self.card_no_encrypted
            if isinstance(data, str):
                data = data.encode()  # str -> bytes
            encrypted_bytes = base64.urlsafe_b64decode(data)
            return fernet.decrypt(encrypted_bytes).decode()
        except Exception as e:
            print("Card decryption failed:", e)
            return None

    def get_cvv(self):
        if not self.cvv_encrypted:
            return None
        try:
            data = self.cvv_encrypted
            if isinstance(data, str):
                data = data.encode()
            encrypted_bytes = base64.urlsafe_b64decode(data)
            return fernet.decrypt(encrypted_bytes).decode()
        except Exception as e:
            print("CVV decryption failed:", e)
            return None

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
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    card = models.OneToOneField(Account, on_delete=models.CASCADE)
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"Billing for {self.user.username}"