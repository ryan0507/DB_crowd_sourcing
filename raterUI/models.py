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

class Task(models.Model):
    TaskID = models.CharField(max_length=20, null=False, primary_key=True)
    SubmissionPeriod = models.IntegerField(null=False, default=0)
    TableName = models.CharField(max_length=40, null=False, unique=True)
    TaskSchema = models.TextField(null=False, default='')
    Name = models.CharField(max_length=40, null=False)
    Description = models.TextField(null=False, default='')

class Original_Data_Type(models.Model):
    OriginalTypeID = models.CharField(max_length=20, null=False, primary_key=True)
    TaskID = models.ForeignKey(
        Task,
        null=False,
        on_delete=models.CASCADE
    )
    OriginalSchema = models.TextField(null=False)
    Mapping = models.TextField(null=False)
    TaskThresHold = models.DecimalField(max_digits=6, decimal_places=4, null=False, default=0)

class Parsing_Data(models.Model):
    SubmissionID = models.CharField(max_length=20, null=False, primary_key=True)
    OriginalTypeID = models.ForeignKey(
        Original_Data_Type,
        on_delete=models.CASCADE
    )
    SubmitterID = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        related_name='submitter'
    )
    AssessorID = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        related_name='assessor'
    )
    SubmissionNumber = models.IntegerField(null=False)
    SubmissionDate = models.DateTimeField(null=False)
    StartDate = models.DateField()
    FileName = models.CharField(max_length=100, null=False, default='')
    EndDate = models.DateField()
    NumberOfTuple = models.IntegerField(null=False)
    QUanAssessment = models.DecimalField(max_digits=6, decimal_places=4, null=False)
    QUalAssessment = models.DecimalField(max_digits=6, decimal_places=4)
    P_NP = models.CharField(max_length=2, null=False, default='W')

class Participate_Task(models.Model):
    OriginaTypeID = models.ForeignKey(
        Original_Data_Type,
        unique=True,
        primary_key=True,
        on_delete=models.CASCADE,
        default=''
    )
    SubmitterID = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE
    )
    TaskID = models.ForeignKey(
        Task,
        null=False,
        on_delete=models.CASCADE
    )
    Pass = models.CharField(max_length=1, null=False, default='W')
