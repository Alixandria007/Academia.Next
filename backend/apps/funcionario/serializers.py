from rest_framework import serializers
from . import models

class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Funcionario
        fields = 'id' ,'first_name', 'last_name', 'email','cpf', 'telefone', 'entrada', 'saida', 'foto', 'data_admissao', 'salario'

class InstrutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Instrutor
        fields = 'id' ,'first_name', 'last_name', 'email','cpf', 'telefone', 'entrada', 'saida', 'foto', 'data_admissao', 'salario', 'cref'

class InstrutorSerializerAula(serializers.ModelSerializer):
    class Meta:
        model = models.Instrutor
        fields = 'id' ,'first_name', 'last_name', 'foto'