from django.shortcuts import render, get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status
from django.http import Http404
from datetime import date
from . import models, serializers

# Create your views here.

class AtividadeView(APIView):
    def get(self, request):
        limit = int(request.GET.get('limit'))

        try:
            atividade = get_list_or_404(models.Atividade.objects.order_by('-data_hora')[:limit] if limit else models.Atividade)
            serializer = serializers.AtividadeSerializer(atividade, many = True)

            return Response(serializer.data)
        except Http404:
            return Response({"detail":"Atividades não foram encontradas!!"}, status=status.HTTP_404_NOT_FOUND)
        

class DashBoardView(APIView):
    def get(self, request):
        try:
            from ..aula.models import DiaSemana
            from ..aluno.models import Aluno
            from ..funcionario.models import Funcionario
            from ..plano.models import Plano

            aulas_per_dia = DiaSemana.objects.annotate(total_aulas_dia=Count('aula')).values('nome', 'total_aulas_dia')
            total_aulas = 0 
            
            for aula in aulas_per_dia.values():
                total_aulas += aula.get('total_aulas_dia')

            instrutores = Funcionario.objects.all().count()
            alunos = Aluno.objects.all().count()
            planos = Plano.objects.all().count()
           
            return Response({'alunos': alunos,'aulas': total_aulas, 'instrutores': instrutores, 'planos': planos}, status = status.HTTP_200_OK)
        except Http404:
            return Response({'detail': 'ERRO!!'}, status = status.HTTP_400_BAD_REQUEST)

class ActivityChartView(APIView):
    def get(self, request):
        try:
            hoje = timezone.now()
            semana = [(hoje - timezone.timedelta(days=i)).date() for i in range(7)]
            resultado = []
            for dia in semana:
                resultado.append({'dia':dia.strftime("%d/%m/%Y"), 'total': models.Atividade.objects.filter(data_hora__date = dia).count()})
            return Response(resultado, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)