from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Instrutor)
class InstrutorAdmin(admin.ModelAdmin):
    list_display = 'id', 'username', 'cref', 'telefone'
    list_display_links = 'id',
    ordering = '-id',