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
        fields = 'id', 'aluno', 'plano','total', 'data_assinatura', 'vencimento'


    def to_representation(self, instance):
        data = super().to_representation(instance)  
        expand_aluno = self.context.get("expand_aluno", False)  

        if expand_aluno:
            data["aluno"] = AlunoSerializer(instance.aluno).data 

        return data
    
    def validate(self, data):
        user = data.get("aluno")
        plano = data.get("plano")
        data_assinatura = timezone.now().date()
        vencimento_novo = data.get('vencimento')

        if not user:
            raise serializers.ValidationError("O campo 'aluno' é obrigatório.")
        if not plano:
            raise serializers.ValidationError("O campo 'plano' é obrigatório.")
        if not vencimento_novo:
            raise serializers.ValidationError("O campo 'vencimento' é obrigatório.")

        assinatura_ativa = Assinatura.objects.filter(aluno=user, plano=plano, vencimento__gte=data_assinatura).first()

        if assinatura_ativa:
            dias_restantes = (assinatura_ativa.vencimento - data_assinatura).days
            if dias_restantes < 0:
                raise serializers.ValidationError("A data de vencimento da nova assinatura não pode ser anterior à assinatura ativa.")
            
            data["vencimento"] = vencimento_novo + timezone.timedelta(days=dias_restantes)
        else:
            data["vencimento"] = vencimento_novo

        return data



class AtividadeExtraSerializer(serializers.ModelSerializer):

    class Meta:
        model = AtividadeExtra
        fields = "__all__"