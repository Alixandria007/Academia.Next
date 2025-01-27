from .models import Atividade
from rest_framework import serializers

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fields = ['id', 'tipo_acao', 'descricao', 'data_hora']