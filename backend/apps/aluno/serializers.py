from rest_framework import serializers
from . import models

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Aluno
        fields = 'username', 'first_name', 'last_name', 'email','cpf', 'telefone', 'data_nascimento','ativo', 'responsavel'

class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Responsavel
        fields = 'username', 'first_name', 'last_name', 'email', 'cpf','telefone', 'data_nascimento'