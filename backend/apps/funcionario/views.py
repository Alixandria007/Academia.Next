from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers

# Create your views here.

class FuncionarioView(APIView):
    def get(self, request):
        funcionarios = models.Funcionario.objects.all()
        serializer = serializers.FuncionarioSerializer(funcionarios, many=True)
        return Response(serializer.data)