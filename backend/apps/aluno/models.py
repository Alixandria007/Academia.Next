from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser,Group, Permission

# Create your models here.
    
class Aluno(models.Model):

    class Meta:
        verbose_name = 'Aluno'
        verbose_name_plural = "Alunos"

    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    email = models.EmailField()
    telefone = models.CharField(max_length=20, null=True, blank=True)
    data_de_nascimento = models.DateField(null=True, blank=True)
    cpf = models.CharField(max_length=14, unique=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f'Aluno {self.first_name} {self.last_name}'
    
class AvaliacaoFisica(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='avaliacoes_fisicas')
    data_avaliacao = models.DateField(auto_now_add=True)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # em kg
    altura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # em metros
    imc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # índice de massa corporal
    gordura_corporal = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # em %
    massa_muscular = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # em kg
    circunferencia_abdominal = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # em cm

    def calcular_imc(self):
        if self.peso and self.altura:
            return self.peso / (self.altura ** 2)
        return None

    def save(self, *args, **kwargs):
        self.imc = self.calcular_imc() if not self.imc else self.imc
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Avaliação Física de {self.aluno.first_name} - {self.data_avaliacao}'
