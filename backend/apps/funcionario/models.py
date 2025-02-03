from django.db import models
from django.utils import timezone

class Funcionario(models.Model):
    def current_date():
        return timezone.now().date()

    class Meta:
        verbose_name = 'Funcionario'
        verbose_name_plural = 'Funcionarios'

    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    email = models.EmailField(max_length = 256)
    foto = models.ImageField(upload_to='funcionarios_fotos/', null=True, blank=True)
    data_admissao = models.DateField(default = current_date)
    entrada = models.TimeField()
    saida = models.TimeField()
    salario = models.DecimalField(max_digits=10, decimal_places=2)    
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    cref = models.CharField(max_length=20, blank=True, null=True, unique=True)

    def __str__(self) -> str:
        return f'Funcionario {self.first_name} {self.last_name}'
