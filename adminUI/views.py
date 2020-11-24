from django.shortcuts import render, get_object_or_404

# Create your views here.

from .models import *

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import *

class AdminMainView(APIView):
    def get(self, request):
        queryset = Task.objects.all()
        serializer = MainSerializer(queryset, many=True)
        return Response(serializer.data)

class TaskDetailView(APIView):
    originaldatatypes = OriginalDataTypeSerializer(many=True, read_only=True)

    def get_object(self, pk):
        return get_object_or_404(Task, pk=pk)
    def get(self, request, pk, format=None):
        task = self.get_object(pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

class UserListView(APIView):
    def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

class UserDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)
    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class OriginalDataTypeView(APIView):
    def get(self, request):
        queryset = Original_Data_Type.objects.all()
        serializer = OriginalDataTypeSerializer(queryset, many=True)
        return Response(serializer.data)

class ParsingDataView(APIView):
    def get(self, request):
        queryset = Parsing_Data.objects.all()
        serializer = ParsingDataSerializer(queryset, many=True)
        return Response(serializer.data)

class ParticipateTaskDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Participate_Task, pk=pk)
    def get(self, request, pk, format=None):
        participate_task = self.get_object(pk)
        serializer = ParticipateTaskSerializer(participate_task)
        return Response(serializer.data)

class CreatingTaskView(generics.GenericAPIView):
    serializer_class = CreateTaskSerializer

    def post(self, request, *args):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(
            {
                "task": TaskSerializer(
                    task, context=self.get_serializer_context()
                ).data,
            }
        )

class CreatingTaskSchemaView(generics.GenericAPIView):
    serializer_class = CreateTaskSchemaSerializer

    def post(self, request, *args):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        taskschema = serializer.save()
        return Response(
            {
                "task scema": TaskSerializer(
                    taskschema, context=self.get_serializer_context()
                ).data,
            }
        )

class CreatingOriginalDataTypeView(generics.GenericAPIView):
    serializer_class = CreateOriginalDataTypeSerializer

    def post(self, request, *args):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        datatype = serializer.save()
        return Response(
            {
                "data type" : OriginalDataTypeSerializer(
                    datatype, context=self.get_serializer_context()
                ).data,
            }
        )