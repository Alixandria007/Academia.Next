from rest_framework import serializers
from . import models

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Aluno
        fields = "__all__"

class AvaliaçãoFisicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AvaliacaoFisica
        fields = 'id', 'aluno', 'data_avaliacao', 'peso', 'altura','imc', 'gordura_corporal','massa_muscular', 'circunferencia_abdominal'
