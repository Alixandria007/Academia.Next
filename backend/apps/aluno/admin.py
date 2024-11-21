from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = 'id', 'username','cpf','ativo'
    list_display_links = 'id',
    ordering = '-id',

@admin.register(models.Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = 'id', 'username','cpf'
    list_display_links = 'id',
    ordering = '-id',