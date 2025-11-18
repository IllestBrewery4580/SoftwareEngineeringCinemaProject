from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_promotion, name="create_promotion"),
    path("validate/<str:promo_code>", views.validate_promo, name="validate_promo"),
    path("promotionList/", views.promotion_list, name="promotion_list"),
    path("email/<int:promo_id>/", views.email_promotion, name="email_promotion"),
]
