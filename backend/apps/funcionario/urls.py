from django.urls import path
from . import views

urlpatterns = [
    path('', views.FuncionarioView.as_view()),
    path('<int:id>/', views.FuncionarioDetailView.as_view()),
    path('instrutor/', views.InstrutorView.as_view())
]