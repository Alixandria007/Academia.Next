from rest_framework import serializers
from .models import Plano, Assinatura, AtividadeExtra

class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano
        fields = ['id', 'nome', 'valor', 'duracao', 'atividade_extra']

class AssinaturaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assinatura
        fields = [
            'id', 'aluno', 'plano','total', 'data_assinatura', 'vencimento'
        ]

class AtividadeExtraSerializer(serializers.ModelSerializer):

    class Meta:
        model = AtividadeExtra
        fields = "__all__"