# Generated by Django 5.1.1 on 2024-11-02 03:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_follow_post'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together={('follower', 'followed')},
        ),
    ]