from django.shortcuts import render, get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from . import models
from . import serializers

# Create your views here.

class AulaView(APIView):
    def get(self, request):
        aulas = get_list_or_404(models.Aula)
        serializer = serializers.AulaSerializerGet(aulas, many = True)

        return Response(serializer.data)
    
    def post(self, request):
        data = request.data

        serializer = serializers.AulaSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail":"Aula cadastrada com sucesso!!"}, status= status.HTTP_201_CREATED)
        
        return Response({"detail":"Erro ao cadastrar aula!!"}, status=status.HTTP_400_BAD_REQUEST)


class AulaDetailView(APIView):
    def get(self, request, id):
        aula = get_object_or_404(models.Aula, id=id)
        serializer = serializers.AulaSerializerGet(aula)

        return Response(serializer.data)
    
    def delete(self, request, id):
        try:
            aula = get_object_or_404(models.Aula, id=id)
            aula.delete()
            return Response({"detail":"Aula apagada com sucesso!!!"}, status= status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({"detail": "A aula com o ID fornecido não foi encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
    def patch(self, request, id):
        data = request.data

        try:
            aula = get_object_or_404(models.Aula, id=id)
            serializer = serializers.AulaSerializer(aula, data = data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response({"detail":"Aula atualizada com sucesso!!!"}, status= status.HTTP_200_OK)
            return Response({"detail":"Erro ao atualizar a aula!!!"}, status= status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({"detail": "A aula com o ID fornecido não foi encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
class AulaInscricoesView(APIView):
    def get(self, request, id):
        try:
            inscricao = get_list_or_404(models.Inscrição, aula = id)
            serializer = serializers.InscriçãoSerializerGet(inscricao, many = True)

            return Response(serializer.data , status=status.HTTP_200_OK)
        
        except Http404:
            return Response({"detail": "A Inscrição com o ID fornecido não foi encontrada."}, status=status.HTTP_404_NOT_FOUND)

class InscriçãoView(APIView):
    def post(self, request):
        data = request.data

        serializer = serializers.InscriçãoSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail":"Inscrição feita com sucesso!!"}, status= status.HTTP_201_CREATED)
        
        if models.Inscrição.objects.filter(aula = data.get("aula"), aluno = data.get("aluno")).exists():
            return Response({"detail":"Aluno já esta inscrito na aula!!"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"detail":"Erro ao inscrever aluno!!"}, status=status.HTTP_400_BAD_REQUEST)

