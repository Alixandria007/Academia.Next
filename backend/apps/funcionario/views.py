from django.shortcuts import render, get_object_or_404
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
    
    def post(self,request):
        data = request.data
        serializer = serializers.FuncionarioSerializer(data = data) if not data.get('cref') else serializers.InstrutorSerializer(data = data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Erro ao cadaastrar o funcionario!!', 'errors': serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    
class FuncionarioDetailView(APIView):
    def get(self, request, id):
        funcionario = get_object_or_404(models.Instrutor, id = id) if models.Instrutor.objects.filter(id = id) else get_object_or_404(models.Funcionario, id = id)
        
        if isinstance(funcionario, models.Instrutor):
            serializer = serializers.InstrutorSerializer(funcionario)
        else:
            serializer = serializers.FuncionarioSerializer(funcionario)
            
        return Response(serializer.data)
    
    def patch(self, request, id):
        data = request.data
        funcionario = get_object_or_404(models.Funcionario, id=id)
        serializer = serializers.FuncionarioSerializer(funcionario, data = data, partial = True )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response({'detail':'Erro ao atualizar os dados!!', 'errors': serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        funcionario = get_object_or_404(models.Funcionario, id = id)
        
        if funcionario:
            funcionario.delete()
            return Response('Funcionario Deletado com sucesso!!', status = status.HTTP_204_NO_CONTENT)
        
        else:
            return Response('Funcionario não encontrado!!', status = status.HTTP_404_NOT_FOUND)

class InstrutorView(APIView):
    def get(self, request):
        instrutores = models.Instrutor.objects.all()
        serializer = serializers.InstrutorSerializer(instrutores, many = True)

        return Response(serializer.data)