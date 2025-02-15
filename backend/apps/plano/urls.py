from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.PlanoView.as_view() ),
    path('<int:id>/', views.PlanoDetailView.as_view() ),
    path('assinatura/', views.AssinaturaView.as_view() ),
    path('atividade_extra/', views.AtividadeExtraView.as_view() ),
]