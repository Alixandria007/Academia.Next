from rest_framework import serializers
from . import models

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Aluno
        fields = 'id', 'first_name', 'last_name', 'email','cpf', 'telefone', 'data_de_nascimento','ativo'

class AvaliaçãoFisicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AvaliacaoFisica
        fields = 'id', 'aluno', 'data_avaliacao', 'peso', 'altura','imc', 'gordura_corporal','massa_muscular', 'circunferencia_abdominal'
