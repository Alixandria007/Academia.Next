from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Funcionario)
class FuncionarioAdmin(admin.ModelAdmin):
    list_display = 'id','first_name','last_name', 'telefone'
    list_display_links = 'id',
    ordering = '-id',