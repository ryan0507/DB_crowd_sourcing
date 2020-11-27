# Generated by Django 3.1.2 on 2020-11-23 00:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('adminUI', '0002_auto_20201121_0015'),
    ]

    operations = [
        migrations.AddField(
            model_name='original_data_type',
            name='TaskThresHold',
            field=models.DecimalField(decimal_places=4, default=0, max_digits=6),
        ),
        migrations.AddField(
            model_name='parsing_data',
            name='FileName',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='parsing_data',
            name='P_NP',
            field=models.CharField(default='W', max_length=2),
        ),
        migrations.CreateModel(
            name='Participate_Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Pass', models.CharField(default='W', max_length=1)),
                ('SubmitterID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='adminUI.user')),
                ('TaskID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='adminUI.task')),
            ],
        ),
    ]
