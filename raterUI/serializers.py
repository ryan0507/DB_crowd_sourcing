from rest_framework import serializers
from .models import *

# Basic Serializers

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class OriginalDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Original_Data_Type
        fields = '__all__'

class ParsingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parsing_Data
        fields = '__all__'

class ParticipateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participate_Task
        fields = '__all__'

# JOIN -> View

## Rater [Main] ##

class RaterMainTaskSerializer_task_original(serializers.ModelSerializer):
    taskKey = TaskSerializer(read_only = True)
    class Meta:
        model = Original_Data_Type
        fields = ('OriginalTypeID', 'TaskID')


class RaterMainTaskSerializer(serializers.ModelSerializer):
    taskOriginalKey = RaterMainTaskSerializer_task_original(read_only = True)
    class Meta:
        model = Parsing_Data
        field = ('OriginalTypeID', 'SubmissionDate', 'FileName')

## Rater [Main2] ##