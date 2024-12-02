from rest_framework import serializers
from . import models

class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Funcionario
        fields = 'id' ,'first_name', 'last_name', 'email','cpf', 'telefone', 'entrada', 'saida', 'foto', 'data_admissao'