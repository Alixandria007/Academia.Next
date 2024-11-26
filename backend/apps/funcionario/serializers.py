from rest_framework import serializers
from . import models

class InstrutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Instrutor
        fields = 'username', 'first_name', 'last_name', 'email', 'cref', 'telefone', 'entrada', 'saida', 'foto', 'data_admissao'