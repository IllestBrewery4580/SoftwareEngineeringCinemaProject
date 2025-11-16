from django import forms
from .models import Promotion

class PromotionForm(forms.ModelForm):
    class Meta:
        model = Promotion
        fields = ['promo_code', 'start_date', 'end_date', 'discount_percent', 'description']

     def clean_discount_percent(self):
        discount = self.cleaned_data['discount_percent']
        if discount < 0 or discount > 100:
            raise forms.ValidationError("Discount must be between 0 and 100.")
        return discount
    
    def clean(self):
        cleaned = super().clean()
        start = cleaned.get('start_date')
        end = cleaned.get('end_date')

        if start and end and start > end:
            raise forms.ValidationError("Start date must be before end date.")
        
        return cleaned
