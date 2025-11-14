from django.shortcuts import render, redirect
from .forms import PromotionForm
from .models import Promotion
from django.http import JsonResponse
from .emails import send_promotion_email
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def create_promotion(request):
    if request.method == "POST":
        form = PromotionForm(request.POST)
        if form.is_valid():
            promo = form.save()
            send_promotion_email(promo)  # <--- send emails
            return redirect("promotion_list")
        else:
            form = PromotionForm()

        return render(request, "promotions/create_promotion.html", {"form": form})

@csrf_exempt
def validate_promo(request):
    code = request.GET.get("code")
    try:
        promo = Promotion.objects.get(code=code)
        if promo.is_valid():
            return JsonResponse({
                "valid": True,
                "discount": promo.discount_percent
            })
        else:
            return JsonResponse({"valid": False, "error": "Promo expired or not active"})
    except Promotion.DoesNotExist:
        return JsonResponse({"valid": False, "error": "Promo not found"})
