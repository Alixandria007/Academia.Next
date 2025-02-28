from rest_framework import serializers
from ..aluno.serializers import AlunoSerializer
from .models import Plano, Assinatura, AtividadeExtra

class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano
        fields = ['id', 'nome', 'valor', 'duracao', 'atividade_extra']

class AssinaturaSerializer(serializers.ModelSerializer):
    aluno = serializers.SerializerMethodField()

    class Meta:
        model = Assinatura
        fields = [
            'id', 'aluno', 'plano','total', 'data_assinatura', 'vencimento'
        ]

    def get_aluno(self, obj):
        expand_aluno = self.context.get("expand_aluno", False)

        if expand_aluno:
            return AlunoSerializer(obj.aluno).data

        return obj.aluno.id

class AtividadeExtraSerializer(serializers.ModelSerializer):

    class Meta:
        model = AtividadeExtra
        fields = "__all__"