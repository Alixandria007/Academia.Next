from rest_framework import serializers
from ..funcionario.serializers import FuncionarioSerializer
from .models import Aula, Inscrição, DiaSemana
from ..aluno.serializers import AlunoSerializer

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'nome', 'vagas', 'horario_inicial', 'horario_final', 'instrutor', 'dias_da_semana']

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = ['id','nome']

class AulaSerializerGet(serializers.ModelSerializer):
    instrutor = FuncionarioSerializer()
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

class InscriçãoSerializerGet(serializers.ModelSerializer):
    aluno = AlunoSerializer()

    class Meta:
        model = Inscrição
        fields = ['id', 'aula', 'aluno', 'data_inscricao']
