from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser,Group, Permission

# Create your models here.

class Responsavel(AbstractUser):
    
    class Meta:
        verbose_name = 'Responsavel'
        verbose_name_plural = "Responsaveis"

    telefone = models.CharField(max_length=20, null=True, blank=True)
    data_de_nascimento = models.DateField(null=True, blank=True)
    cpf = models.CharField(max_length=14, unique=True)

    groups = models.ManyToManyField(Group, related_name='responsaveis_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='responsaveis_permissions', blank=True)

    def __str__(self) -> str:
        return f'Responsavel {self.username}'
    
    
class Aluno(AbstractUser):

    class Meta:
        verbose_name = 'Aluno'
        verbose_name_plural = "Alunos"

    telefone = models.CharField(max_length=20, null=True, blank=True)
    data_de_nascimento = models.DateField(null=True, blank=True)
    cpf = models.CharField(max_length=14, unique=True)
    ativo = models.BooleanField(default=True)
    responsavel = models.ForeignKey(Responsavel, on_delete=models.SET_NULL, null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name='alunos_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='alunos_permissions', blank=True)


    def __str__(self):
        return f"{self.username}"
    