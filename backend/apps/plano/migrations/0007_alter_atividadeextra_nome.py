# Generated by Django 5.1.3 on 2025-02-03 00:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plano', '0006_remove_plano_aulas_plano_atividade_extra'),
    ]

    operations = [
        migrations.AlterField(
            model_name='atividadeextra',
            name='nome',
            field=models.CharField(choices=[('aulas_coletivas', 'Aulas Coletivas'), ('funcional', 'Treinamento Funcional'), ('artes_marciais', 'Artes Marciais e Defesa Pessoal'), ('yoga_alongamento', 'Yoga e Alongamento')], max_length=100, unique=True),
        ),
    ]
