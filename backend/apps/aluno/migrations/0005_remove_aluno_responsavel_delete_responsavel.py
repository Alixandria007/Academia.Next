# Generated by Django 5.1.3 on 2025-02-01 00:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('aluno', '0004_avaliacaofisica_circunferencia_abdominal_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aluno',
            name='responsavel',
        ),
        migrations.DeleteModel(
            name='Responsavel',
        ),
    ]
