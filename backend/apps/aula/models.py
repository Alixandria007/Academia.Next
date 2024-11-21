from django.db import models
from django.utils import timezone
from ..instrutor.models import Instrutor
from ..aluno.models import Aluno

# Create your models here.

class Aula(models.Model):
    class Meta:
        verbose_name = 'Aula'
        verbose_name_plural = 'Aulas'

    nome = models.CharField(max_length=120)
    vagas = models.PositiveIntegerField(default=0)
    horario_inicial = models.TimeField()
    horario_final = models.TimeField()
    instrutor = models.ForeignKey(Instrutor, on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        return self.nome

class Inscrição(models.Model):
    class Meta: 
        verbose_name = 'Inscrição'
        verbose_name = 'Inscricoes'

    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    data_inscricao = models.DateField(default=timezone.now)

    def __str__(self) -> str:
        return f'Inscrição nº{self.id}'