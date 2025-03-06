from rest_framework import serializers
from ..funcionario.serializers import FuncionarioSerializer
from .models import Aula, Inscrição, DiaSemana
from ..plano.serializers import AtividadeExtraSerializer, AssinaturaSerializer

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = '__all__'

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = ['id','nome']

class AulaSerializerGet(serializers.ModelSerializer):
    instrutor = FuncionarioSerializer()
    dias_da_semana = DiaSemanaSerializer(many = True)
    alunos_inscritos = serializers.SerializerMethodField()
    tipo_atividade = AtividadeExtraSerializer()

    class Meta:
        model = Aula
        fields = "__all__"

    def get_alunos_inscritos(self, obj):
        incricoes = Inscrição.objects.filter(aula = obj.id).count()
        return incricoes

class InscriçãoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscrição
        fields = '__all__'

class InscriçãoSerializerGet(serializers.ModelSerializer):
    assinatura = AssinaturaSerializer(context = {'expand_aluno': True})

    class Meta:
        model = Inscrição
        fields = "__all__"
