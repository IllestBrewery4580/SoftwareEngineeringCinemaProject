from django.db import models
from django.core.exceptions import ValidationError

class Promotion(models.Model):
    promo_code = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True)

    def clean(self):
        if self.discount_percent <= 0 or self.discount_percent > 100:
            raise ValidationError("Discount must be between 1 and 100 percent.")

        if self.start_date > self.end_date:
            raise ValidationError("Start date must be before end date.")

    def __str__(self):
        return self.promo_code
