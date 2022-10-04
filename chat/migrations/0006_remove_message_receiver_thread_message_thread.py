# Generated by Django 4.1.1 on 2022-10-04 10:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0005_message_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='receiver',
        ),
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=64, null=True)),
                ('type', models.CharField(choices=[('personal', 'personal'), ('group', 'group')], default='personal', max_length=8)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='message',
            name='thread',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='chat.thread'),
            preserve_default=False,
        ),
    ]
