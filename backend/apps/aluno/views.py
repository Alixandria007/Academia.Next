from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from . import models
from django.http import Http404
from .serializers import AlunoSerializer, AvaliaçãoFisicaSerializer
from ..atividade.models import Atividade


# Create your views here.

class AlunosView(GenericAPIView):
    queryset = models.Aluno.objects.all()
    serializer_class = AlunoSerializer

    def get(self, request):
        queryset = self.get_queryset()  
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            aluno = serializer.save()
            models.Atividade.objects.create(
                tipo_acao='cadastro',
                descricao=f"Aluno {serializer.validated_data['first_name']} {serializer.validated_data['last_name']} cadastrado com sucesso!!"
            )
            return Response({'message': 'Aluno criado com sucesso!'}, status=status.HTTP_201_CREATED)
        
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class AlunoDetailView(APIView):
    def get(self, request, id):
        aluno = get_object_or_404(models.Aluno, id = id)
        serializer = AlunoSerializer(aluno, many = False)
        return Response(serializer.data)
    
    def patch(self, request, id):
        data = request.data
        aluno = models.Aluno.objects.filter(pk = id).first()
        serializer = AlunoSerializer(aluno, data = data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(f'Error: {serializer.errors}', status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        aluno = models.Aluno.objects.filter(pk = id).first()
        
        if aluno:
            Atividade.objects.create(tipo_acao = 'exclusao', descricao = f'Dados de {aluno.first_name} {aluno.last_name} foram deletados')
            aluno.delete()

            return Response('Aluno deletado com sucesso!!!', status=status.HTTP_204_NO_CONTENT)
        else:
            return Response('Aluno não encontrado!!!', status=status.HTTP_404_NOT_FOUND)

class AvaliacaoFisicaView(APIView):
    def get(self, request):
        try:
            id_aluno = int(request.GET.get('id'))

            avaliacoes = get_list_or_404(models.AvaliacaoFisica, aluno = id_aluno) if id_aluno else get_list_or_404(models.AvaliacaoFisica)
            serializer = AvaliaçãoFisicaSerializer(avaliacoes, many = True)

            return Response(serializer.data, status = status.HTTP_200_OK)
        
        except Http404:
            return Response({'detail': 'Não há Avaliações!!!'}, status = status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data

        serializer = AvaliaçãoFisicaSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail":"Avaliação cadastrada com sucesso!!"}, status= status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)