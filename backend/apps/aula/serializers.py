from rest_framework import serializers
from .models import Aula, Inscrição

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'nome', 'vagas', 'horario_inicial', 'horario_final', 'instrutor']

class InscriçãoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscrição
        fields = ['id', 'aula', 'aluno', 'data_inscricao']
