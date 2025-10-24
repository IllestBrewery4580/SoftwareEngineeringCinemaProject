from django.db import models
from django.contrib.auth.models import AbstractUser

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
    card_no = models.CharField(max_length=20, primary_key=True)
    card_type = models.CharField(max_length=20)
    expiration_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.card_no}"


class BillingAddress(models.Model):
    card = models.OneToOneField(Account, on_delete=models.CASCADE)
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.card.user.username} - {self.address_line}"
