# Generated by Django 3.1.3 on 2020-11-28 17:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adminUI', '0011_auto_20201124_1615'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parsing_data',
            name='AssessorID',
        ),
        migrations.RemoveField(
            model_name='parsing_data',
            name='OriginalTypeID',
        ),
        migrations.RemoveField(
            model_name='parsing_data',
            name='SubmitterID',
        ),
        migrations.RemoveField(
            model_name='participate_task',
            name='OriginaTypeID',
        ),
        migrations.RemoveField(
            model_name='participate_task',
            name='SubmitterID',
        ),
        migrations.RemoveField(
            model_name='participate_task',
            name='TaskID',
        ),
        migrations.DeleteModel(
            name='Original_Data_Type',
        ),
        migrations.DeleteModel(
            name='Parsing_Data',
        ),
        migrations.DeleteModel(
            name='Participate_Task',
        ),
        migrations.DeleteModel(
            name='Task',
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]
