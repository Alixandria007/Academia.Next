from django.db import models
from django.utils import timezone
from apps.plano.models import AtividadeExtra
from ..funcionario.models import Funcionario
from ..aluno.models import Aluno

# Create your models here.

from django.db import models

class DiaSemana(models.Model):
    DIAS_CHOICES = [
        ('SEG', 'Segunda-feira'),
        ('TER', 'Terça-feira'),
        ('QUA', 'Quarta-feira'),
        ('QUI', 'Quinta-feira'),
        ('SEX', 'Sexta-feira'),
        ('SAB', 'Sábado'),
        ('DOM', 'Domingo'),
    ]

    nome = models.CharField(max_length=3, choices=DIAS_CHOICES, unique=True)

    def __str__(self):
        return dict(self.DIAS_CHOICES)[self.nome]


class Aula(models.Model):
    class Meta:
        verbose_name = 'Aula'
        verbose_name_plural = 'Aulas'

    nome = models.CharField(max_length=120)
    vagas = models.PositiveIntegerField(default=1)
    horario_inicial = models.TimeField()
    horario_final = models.TimeField()
    instrutor = models.ForeignKey(Funcionario, on_delete=models.SET_NULL, null=True)
    dias_da_semana = models.ManyToManyField(DiaSemana)
    tipo_atividade = models.ForeignKey(AtividadeExtra, on_delete=models.CASCADE, default=1)

    def __str__(self) -> str:
        dias = ", ".join([str(dia) for dia in self.dias_da_semana.all()])
        return f"{self.nome} - {dias}"


class Inscrição(models.Model):
    def current_date():
        return timezone.now().date()
    
    class Meta: 
        verbose_name = 'Inscrição'
        verbose_name = 'Inscricoes'

    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    data_inscricao = models.DateField(default=current_date)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['aula', 'aluno'],
                name='unique_aula_aluno',
                violation_error_message='Este aluno já esta inscrito na aula!!!'
            )
        ]

    def __str__(self) -> str:
        return f'Inscrição nº{self.id}'