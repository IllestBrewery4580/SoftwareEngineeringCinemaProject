from django.urls import path
from . import views

urlpatterns = [
    path("promotion/", include("promotions.urls")),
    path("create/", views.create_promotion, name="create_promotion"),
    path("validate/", views.validate_promo, name="validate_promo")
]
