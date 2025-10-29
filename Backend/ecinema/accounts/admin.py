from django.contrib import admin

# Register your models here.
from .models import CustomUser, Account, BillingAddress

admin.site.register(CustomUser)
admin.site.register(Account)
admin.site.register(BillingAddress)