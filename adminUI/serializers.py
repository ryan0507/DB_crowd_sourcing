from rest_framework import serializers
from .models import *

class MainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('Name', 'Description')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('ID', 'Name', 'DateOfBirth', 'Gender', 'PhoneNumber')

class OriginalDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Original_Data_Type
        fields = ('OriginalTypeID', 'TaskID', 'OriginalSchema')

class ParsingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parsing_Data
        fields = '__all__'

class ParticipateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participate_Task
        fields = '__all__'

class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def create(self, validated_data):
        task = Task.objects.create(
            validated_data["TaskID"], None, None, None, validated_data["Name"], None
        )
        return task

class CreateTaskSchemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('TaskID', 'TaskSchema')

    def create(self, validated_data):
        taskschema = Task.objects.create(
            None, validated_data["TaskSchema"]
        )
        return taskschema

class CreateOriginalDataTypeSerializer(serializers.ModelSerializer):
    class Meta :
        model = Original_Data_Type
        fields = ('OriginalTypeID', 'TaskID', 'OriginalSchema')

    def create(self, validated_data):
        datatype = Original_Data_Type.objects.create(
            None, validated_data["TaskID"], validated_data["OriginalSchema"]
        )
        return datatype