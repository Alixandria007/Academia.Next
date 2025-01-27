from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.AlunosView.as_view()),
    path('<int:id>/', views.AlunoDetailView.as_view()),
    path('avaliacao_fisica/', views.AvaliacaoFisicaView.as_view()),
]