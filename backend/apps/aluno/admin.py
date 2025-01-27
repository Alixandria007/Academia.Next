from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = 'id', 'first_name','cpf','ativo'
    list_display_links = 'id',
    ordering = '-id',

@admin.register(models.AvaliacaoFisica)
class AvaliacaoFisica(admin.ModelAdmin):
    list_display = ('aluno', 'data_avaliacao', 'peso', 'altura', 'imc') 
    search_fields = ('aluno__first_name',)  
    readonly_fields = ('imc',)  

    def save_model(self, request, obj, form, change):
        obj.imc = obj.calcular_imc()
        super().save_model(request, obj, form, change)