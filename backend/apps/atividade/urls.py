from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.AtividadeView.as_view()),
    path('dashboard/', views.DashBoardView.as_view()),
    path('chart/', views.ActivityChartView.as_view()),

]