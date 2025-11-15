from django import forms
from .models import Promotion

class PromotionForm(forms.ModelForm):
    class Meta:
        model = Promotion
        fields = ['promo_code', 'start_date', 'end_date', 'discount_percent', 'description']