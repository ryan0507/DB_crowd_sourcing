# Generated by Django 3.1.2 on 2020-11-23 04:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('adminUI', '0007_auto_20201123_1327'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participate_task',
            name='OriginaTypeID',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='adminUI.original_data_type', unique=True),
        ),
    ]
