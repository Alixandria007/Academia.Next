from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.AulaView.as_view()),
    path('<int:id>/', views.AulaDetailView.as_view()),
    path('<int:id>/inscricao', views.AulaInscricoesView.as_view()),
    path('inscricao/', views.InscriçãoView.as_view()),
]