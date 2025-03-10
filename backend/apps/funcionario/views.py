from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.db.models import F
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..atividade.models import Atividade
from . import models, serializers
from utils import create_activity

# Create your views here.

class FuncionarioView(APIView):
    def get(self, request):
        cref_boolean = request.GET.get('cref_boolean')
        instrutores = request.GET.get('instrutores')

        funcionarios = (
            get_list_or_404(
                models.Funcionario.objects.order_by('first_name'),
                cref__isnull=False
            ) if instrutores else 
            get_list_or_404(
                models.Funcionario.objects.order_by(
                    Coalesce(F('cref'), 0).desc(),  
                    'first_name'  
                )
            )
        )

        serializer_class = serializers.FuncionarioSerializerCrefBoolean if cref_boolean else serializers.FuncionarioSerializer
        serializer = serializer_class(funcionarios, many=True)

        return Response(serializer.data)
    
    def post(self,request):
        data = request.data
        serializer = serializers.FuncionarioSerializer(data = data)

        if serializer.is_valid():
            serializer.save()
            create_activity(
                tipo = 'cadastro',
                descricao = f'Novo funcionario cadastrado com o nome {serializer.validated_data['first_name']} {serializer.validated_data['last_name']}!!!'
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Erro ao cadaastrar o funcionario!!', 'errors': serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    
class FuncionarioDetailView(APIView):
    def get(self, request, id):
        funcionario = get_object_or_404(models.Funcionario, id = id)
        
        serializer = serializers.FuncionarioSerializer(funcionario)
            
        return Response(serializer.data)
    
    def patch(self, request, id):
        data = request.data
        funcionario = get_object_or_404(models.Funcionario, id=id)
        serializer = serializers.FuncionarioSerializer(funcionario, data = data, partial = True )
        if serializer.is_valid():
            serializer.save()

            create_activity(
                tipo = 'atualizacao', 
                descricao = f'Funcionario {funcionario.first_name} do id {funcionario.id} foi atualizado com sucesso!!!'
                )
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response({'detail':'Erro ao atualizar os dados!!', 'errors': serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        funcionario = get_object_or_404(models.Funcionario, id = id)
        
        if funcionario:
            create_activity(
                tipo = 'exclusao', 
                descricao = f'Funcionario {funcionario.first_name} do id {funcionario.pk} foi deletado com sucesso!!!'
                )
            funcionario.delete()
            return Response('Funcionario Deletado com sucesso!!', status = status.HTTP_204_NO_CONTENT)
        
        else:
            return Response('Funcionario não encontrado!!', status = status.HTTP_404_NOT_FOUND)