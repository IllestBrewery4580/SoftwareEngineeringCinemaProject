from django.db import models
from django.utils import timezone

class Promotion(models.Model):
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    discount_percent = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()

    def is_valid(self):
        today = timezone.now().date()
        
        if not self.ative:
            return False
        
        if self.start_date and self.start_date > today:
            return False
        
        if self.end_date and self.end_date < today:
            return False
        
        return True
    
    def __str__(self):
        return self.code
