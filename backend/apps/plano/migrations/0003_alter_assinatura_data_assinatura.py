# Generated by Django 5.1.3 on 2024-12-19 20:08

import apps.plano.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plano', '0002_plano_aulas'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assinatura',
            name='data_assinatura',
            field=models.DateField(default=apps.plano.models.Assinatura.current_date),
        ),
    ]
