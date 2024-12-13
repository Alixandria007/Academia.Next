from django.shortcuts import render, get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models
from . import serializers

# Create your views here.

class AulaView(APIView):
    def get(self, request):
        aulas = get_list_or_404(models.Aula)
        serializer = serializers.AulaSerializerGet(aulas, many = True)

        return Response(serializer.data)
