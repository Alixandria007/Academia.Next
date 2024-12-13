from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Aula)
class AulaAdmin(admin.ModelAdmin):
    list_display = 'id', 'nome','instrutor', 'vagas'
    list_display_links = 'id',
    ordering = '-id',

@admin.register(models.Inscrição)
class InscricaoAdmin(admin.ModelAdmin):
    list_display = 'id', 'aluno', 'aula'
    list_display_links = 'id',
    ordering = '-id',

@admin.register(models.DiaSemana)
class DiaSemanaAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)