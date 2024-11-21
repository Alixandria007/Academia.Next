from django.db import models
from django.contrib.auth.models import AbstractUser,Group, Permission

# Create your models here.

class Instrutor(AbstractUser):
    class Meta:
        verbose_name = 'Instrutor'
        verbose_name_plural = 'Instrutores'

    foto = models.ImageField()
    data_admissao = models.DateField()
    entrada = models.TimeField()
    saida = models.TimeField()
    cref = models.CharField(max_length=20)
    telefone = models.CharField(max_length=20, null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name='instrutores_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='intrutores_permissions', blank=True)

    def __str__(self) -> str:
        return f'Instrutor {self.username}'
