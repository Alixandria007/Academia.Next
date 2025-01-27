from rest_framework import serializers
from .models import Plano, Assinatura

class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano
        fields = ['id', 'nome', 'valor', 'duracao', 'aulas']

class AssinaturaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assinatura
        fields = [
            'id', 'aluno', 'plano','total', 'data_assinatura', 'vencimento'
        ]