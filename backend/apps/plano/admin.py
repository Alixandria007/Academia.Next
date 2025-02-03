from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Plano)
class PlanoAdmin(admin.ModelAdmin):
    list_display =  'id', 'nome', 'valor'
    list_display_links = 'id',
    ordering = '-id',

@admin.register(models.Assinatura)
class AssinaturaAdmin(admin.ModelAdmin):
    list_display =  'id', 'plano', 'aluno'
    list_display_links = 'id',
    ordering = '-id',

@admin.register(models.AtividadeExtra)
class AtividadeAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descricao') 
    search_fields = ('nome',)