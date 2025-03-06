from django.utils import timezone
from rest_framework import serializers
from ..aluno.serializers import AlunoSerializer
from .models import Plano, Assinatura, AtividadeExtra

class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano
        fields = ['id', 'nome', 'valor', 'duracao', 'atividade_extra']

class AssinaturaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assinatura
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)  
        expand_aluno = self.context.get("expand_aluno", False)
        expand_plano = self.context.get("expand_plano", False)  


        if expand_aluno:
            data["aluno"] = AlunoSerializer(instance.aluno).data 

        if expand_plano:
            data["plano"] = PlanoSerializer(instance.plano).data 
            
        return data
    
    def validate(self, data):
        user = data.get("aluno")
        data_assinatura = timezone.now().date()
        vencimento_novo = data.get('vencimento')

        if not user:
            raise serializers.ValidationError("O campo 'aluno' é obrigatório.")
        if not vencimento_novo:
            raise serializers.ValidationError("O campo 'vencimento' é obrigatório.")

        assinatura_ativa = Assinatura.objects.filter(aluno=user, vencimento__gte=data_assinatura).first()

        if assinatura_ativa:
            raise serializers.ValidationError(("O usuario já possui uma assinatura ativa, não é permitido uma nova renovação"))
            
        data["vencimento"] = vencimento_novo

        return data



class AtividadeExtraSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='get_nome_display', read_only=True)
     
    class Meta:
        model = AtividadeExtra
        fields = "__all__"