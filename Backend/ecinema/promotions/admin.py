from django.contrib import admin
from .models import Promotion

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_percent", "start_daate", "end_date", "is_valid")
    search_fields = ("code",)
    list_filter = ("start_date", "end_date")
