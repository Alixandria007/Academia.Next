# Generated by Django 5.1.3 on 2024-12-17 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aluno', '0004_avaliacaofisica_circunferencia_abdominal_and_more'),
        ('aula', '0005_alter_inscrição_options_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='inscrição',
            unique_together=set(),
        ),
        migrations.AddConstraint(
            model_name='inscrição',
            constraint=models.UniqueConstraint(fields=('aula', 'aluno'), name='unique_aula_aluno', violation_error_message='Este aluno já esta inscrito na aula!!!'),
        ),
    ]
