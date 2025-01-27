from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Atividade


@admin.register(Atividade)
class AtividadeAdmin(admin.ModelAdmin):
    list_display = ('tipo_acao', 'descricao_resumida', 'data_hora')
    list_filter = ('tipo_acao', 'data_hora')
    search_fields = ('descricao',)
    ordering = ['-data_hora']

    def descricao_resumida(self, obj):
        return obj.descricao[:50] + '...' if obj.descricao and len(obj.descricao) > 50 else obj.descricao

    descricao_resumida.short_description = 'Descrição'
