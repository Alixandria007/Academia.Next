from django.urls import path, include
from .views import AlunosView
urlpatterns = [
    path('', AlunosView.as_view())
]