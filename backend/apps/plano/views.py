from django.shortcuts import render, get_list_or_404, get_object_or_404
from django.db.models import Max, Subquery, OuterRef
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from . import models, serializers
from ..aluno.models import Aluno
from utils import create_activity

# Create your views here.

class PlanoView(APIView):
    def get(self, request):
        try:
            plano = get_list_or_404(models.Plano)
            serializer = serializers.PlanoSerializer(plano, many = True)

            return Response(serializer.data)
        except Http404:
            return Response({"detail":"Planos não foram encontrados!!"}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        data = request.data

        serializer = serializers.PlanoSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            create_activity(tipo = 'cadastro', descricao = f'Novo Plano foi cadastrado com o nome {serializer.validated_data['nome']}!!!')

            return Response({"detail":"Plano cadastrado com sucesso!!"}, status= status.HTTP_201_CREATED)
        
        return Response({"detail":"Erro ao cadastrar aula!!"}, status=status.HTTP_400_BAD_REQUEST)
        
class PlanoDetailView(APIView):
    def get(self, request, id):
        try:
            plano = get_object_or_404(models.Plano, id = id)
            serializer = serializers.PlanoSerializer(plano)

            return Response(serializer.data)
        except Http404:
            return Response({"detail":"Planos não foram encontrados!!"}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, id):
        try:
            plano = get_object_or_404(models.Plano, id = id)
            plano.delete()

            create_activity(tipo = 'atualizacao', descricao = f'Plano {plano.nome} do id {plano.pk} foi deletado com sucesso!!!')

            return Response({"detail": "Plano deletado com sucesso!!"}, status = status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({"detail":"Planos não foram encontrados!!"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        data = request.data
        plano = get_object_or_404(models.Plano, id=id)
        serializer = serializers.PlanoSerializer(plano, data = data, partial = True )
        if serializer.is_valid():
            serializer.save()
            create_activity(tipo = 'atualizacao', descricao = f'Plano {plano.nome} foi atualizado com sucesso!!!')
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response({'detail':'Erro ao atualizar os dados!!', 'errors': serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
class AssinaturaView(APIView):
    def get(self, request):
        plano = request.GET.get('plano')
        aluno = request.GET.get('aluno_id')
        tipo_atividades = request.GET.get('tipo_atividade')
        ultima_assinatura = models.Assinatura.objects.values('aluno').annotate(ultimo_vencimento=Max('vencimento'))

        if aluno:
             """Consulta detalhada de um aluno especifico"""

             assinatura = models.Assinatura.objects.filter(aluno = aluno, vencimento__gte = timezone.now().date()).last()
            
             serializer = serializers.AssinaturaSerializer(assinatura, context={'expand_plano': True})

        elif plano:
            """Consulta detalhada de um plano especifico"""
            
            assinaturas = models.Assinatura.objects.filter(
                plano=plano,
                vencimento__gte=timezone.now().date(),
            )

            serializer = serializers.AssinaturaSerializer(assinaturas, many=True, context={'expand_aluno': True})
        
        #Consulta detalhada de um tipo de atividade especifico
        elif tipo_atividades:
            assinaturas = models.Assinatura.objects.filter(
                plano__atividade_extra__in = tipo_atividades ,
                vencimento__gte=timezone.now().date(),
            )

            serializer = serializers.AssinaturaSerializer(assinaturas, many=True, context={'expand_aluno': True})

        else:
            """Consulta mais geral de assinaturas, com aluno como um id"""

            assinaturas = models.Assinatura.objects.filter(aluno__in=[item['aluno'] for item in ultima_assinatura])
            serializer = serializers.AssinaturaSerializer(assinaturas, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        duracao = data['duracao']

        match data.get('duracao'):
            case 'Men':
                data['total'] = (data['valor']) * 1
                data['duracao'] = 30

            case 'Tri':
                data['total'] = (data['valor']) * 3
                data['duracao'] = 90

            case 'Sem':
                data['total'] = (data['valor']) * 6
                data['duracao'] = 180

            case 'Anual':
                data['total'] = (data['valor']) * 12
                data['duracao'] = 365

        data['vencimento'] = timezone.now().date() + timezone.timedelta(days=data['duracao'])

        data['valor'] = None
        
        aluno = get_object_or_404(Aluno, id = data['aluno'])
        data['duracao'] = None

        serializer = serializers.AssinaturaSerializer(data = data)
        print(data)
        if serializer.is_valid():
            serializer.save()

            create_activity(tipo = 'assinatura', descricao = f'Nova assinatura de plano do tipo {duracao} do aluno {aluno.first_name} {aluno.last_name} do ID-{aluno.pk}')
            return Response({"detail":"Assinatura cadastrada com sucesso!!"}, status= status.HTTP_201_CREATED)
        
        return Response({"detail":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class AtividadeExtraView(APIView):
    def get(self, request):
        model = get_list_or_404(models.AtividadeExtra)
        serializer = serializers.AtividadeExtraSerializer(model, many = True)

        return Response(serializer.data)