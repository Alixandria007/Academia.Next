from rest_framework import serializers
from . import models

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Aluno
        fields = 'id', 'first_name', 'last_name', 'email','cpf', 'telefone', 'data_de_nascimento','ativo', 'responsavel'

class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Responsavel
        fields = 'id', 'first_name', 'last_name', 'email', 'cpf','telefone', 'data_de_nascimento'