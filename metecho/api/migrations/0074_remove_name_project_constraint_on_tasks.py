# Generated by Django 3.0.6 on 2020-05-14 19:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0073_remove_name_repo_constraint_on_projects"),
    ]

    operations = [
        migrations.AlterUniqueTogether(name="task", unique_together=set(),),
    ]