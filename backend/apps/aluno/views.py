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
    
    def post(self, request):
        data = request.data

        serializer = AlunoSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response('Aluno Criado com Sucesso!!', status=status.HTTP_201_CREATED)
        
        return Response(f'Error: {serializer.errors}', status=status.HTTP_400_BAD_REQUEST)
    
class AlunoDetailView(APIView):
    def get(self, request, id):
        aluno = Aluno.objects.filter(pk = id).first()
        serializer = AlunoSerializer(aluno, many = False)
        return Response(serializer.data)
    
    def post(self, request, id):
        data = request.data
        aluno = Aluno.objects.filter(pk = id).first()
        serializer = AlunoSerializer(aluno, data = data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(f'Error: {serializer.errors}', status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        aluno = Aluno.objects.filter(pk = id).first()
        
        if aluno:
            aluno.delete()
            return Response('Aluno deletado com sucesso!!!', status=status.HTTP_204_NO_CONTENT)
        else:
            return Response('Aluno não encontrado!!!', status=status.HTTP_404_NOT_FOUND)

