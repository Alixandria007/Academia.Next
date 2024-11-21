from rest_framework import serializers
from .models import Plano, Assinatura

class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano
        fields = ['id', 'nome', 'valor', 'duracao']

class AssinaturaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assinatura
        fields = [
            'id', 'aluno', 'aluno_nome', 'plano', 'plano_nome',
            'total', 'data_assinatura', 'vencimento'
        ]