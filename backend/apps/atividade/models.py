from django.db import models
from django.utils import timezone

# Create your models here.

class Atividade(models.Model):
    TIPOS_ACAO = [
        ('cadastro', 'Cadastro'),
        ('assinatura', 'Assinatura de Plano'),
        ('inscricao', 'Inscrição em aula'),
        ('atualizacao', 'Atualização de Dados'),
        ('exclusao', 'Exclusão de Dados'),
    ]

    tipo_acao = models.CharField(max_length=20, choices=TIPOS_ACAO)
    descricao = models.TextField(blank=True, null=True)
    data_hora = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.get_tipo_acao_display()} - {self.data_hora.strftime("%d/%m/%Y %H:%M")}'

    class Meta:
        verbose_name = 'Registro de Atividade'
        verbose_name_plural = 'Registros de Atividades'
        ordering = ['-data_hora']