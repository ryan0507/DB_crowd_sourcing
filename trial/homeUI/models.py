from django.db import models

# Create your models here.

class User(models.Model):
    MainID = models.CharField(max_length=20, null=False, primary_key=True)
    ID = models.CharField(max_length=20, null=False, unique=True)
    Password = models.CharField(max_length=20, null=False)
    Name = models.CharField(max_length=20, null=False)
    Gender = models.CharField(max_length=1, null=False)
    Address = models.TextField(null=False)
    DateOfBirth = models.DateField(null=False)
    PhoneNumber = models.CharField(max_length=11, null=False)
