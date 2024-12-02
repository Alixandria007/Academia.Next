from django.urls import path
from . import views

urlpatterns = [
    path('', views.FuncionarioView.as_view())
]