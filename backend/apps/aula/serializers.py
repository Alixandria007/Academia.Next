from rest_framework import serializers
from .models import Aula, Inscrição, DiaSemana
from ..funcionario.serializers import InstrutorSerializerAula

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'nome', 'vagas', 'horario_inicial', 'horario_final', 'instrutor', 'dias_da_semana']

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = ['nome']

class AulaSerializerGet(serializers.ModelSerializer):
    instrutor = InstrutorSerializerAula()
    dias_da_semana = DiaSemanaSerializer(many = True)
    alunos_inscritos = serializers.SerializerMethodField()

    class Meta:
        model = Aula
        fields = ['id', 'nome', 'vagas', 'horario_inicial', 'horario_final', 'instrutor', 'dias_da_semana', 'alunos_inscritos']

    def get_alunos_inscritos(self, obj):
        incricoes = Inscrição.objects.filter(aula = obj.id).count()
        return incricoes

class InscriçãoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscrição
        fields = ['id', 'aula', 'aluno', 'data_inscricao']
