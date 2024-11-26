from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Funcionario(AbstractUser):
    class Meta:
        verbose_name = 'Funcionario'
        verbose_name_plural = 'Funcionarios'

    foto = models.ImageField(upload_to='funcionarios_fotos/', null=True, blank=True)
    data_admissao = models.DateField()
    entrada = models.TimeField()
    saida = models.TimeField()
    cpf = models.CharField(max_length=14)
    telefone = models.CharField(max_length=20, null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name='funcionarios_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='funcionarios_permissions', blank=True)

    def __str__(self) -> str:
        return f'Funcionario {self.first_name} {self.last_name}'
    

class Instrutor(Funcionario):
    class Meta:
        verbose_name = 'Instrutor'
        verbose_name_plural = 'Instrutores'

    cref = models.CharField(max_length=20)

    def __str__(self) -> str:
        return f'Instrutor {self.first_name} {self.last_name}'
