# Generated by Django 5.1.1 on 2025-01-29 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.CharField(choices=[('Submitted', 'Submitted'), ('Reviewed', 'Reviewed'), ('Rejected', 'Rejected'), ('To Apply', 'To Apply'), ('Interviewing', 'Interviewing'), ('Offer Received', 'Offer Received'), ('Withdraw', 'Withdraw')], default='To Apply', max_length=50),
        ),
    ]
