from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Aluno, Responsavel
from .serializers import AlunoSerializer

# Create your views here.

class AlunosView(APIView):
    def get(self,request):
        alunos = Aluno.objects.all()
        serializer = AlunoSerializer(alunos, many = True)
        return Response(serializer.data)