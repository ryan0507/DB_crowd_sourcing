from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import mysql.connector
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")

def select(query, bufferd=True):
  global dbconn;
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;


def HomeMainView(request):
    result_lst = []
    for row in select("""SELECT MAINID, ID, PASSWORD, NAME, GENDER, ADDRESS, DATEOFBIRTH, PHONENUMBER
                      FROM USER"""):
        tmp_dict = {"MainID": row[0], "ID" : row[1], "Password" : row[2], "Name" : row[3], "Gender" : row[4], "Address" : row[5], "DateOfBirth" : row[6], "PhoneNumber" : row[7]}
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)


# from django.shortcuts import render, get_object_or_404
#
# # Create your views here.
#
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import generics
# from .serializers import *
#
# ## [BASIC] Views ##
# class TaskDetailView(APIView):
#     def get_object(self, pk):
#         return get_object_or_404(Task, pk=pk)
#     def get(self, request, pk, format=None):
#         task = self.get_object(pk)
#         serializer = TaskSerializer(task)
#         return Response(serializer.data)
#
# class UserListView(APIView):
#     def get(self, request):
#         queryset = User.objects.all()
#         serializer = UserSerializer(queryset, many=True)
#         return Response(serializer.data)
#
# class UserDetailView(APIView):
#     def get_object(self, pk):
#         return get_object_or_404(User, pk=pk)
#     def get(self, request, pk, format=None):
#         user = self.get_object(pk)
#         serializer = UserSerializer(user)
#         return Response(serializer.data)
#
# class OriginalDataTypeView(APIView):
#     def get(self, request):
#         queryset = Original_Data_Type.objects.all()
#         serializer = OriginalDataTypeSerializer(queryset, many=True)
#         return Response(serializer.data)
#
# class ParsingDataView(APIView):
#     def get(self, request):
#         queryset = Parsing_Data.objects.all()
#         serializer = ParsingDataSerializer(queryset, many=True)
#         return Response(serializer.data)
#
# class ParticipateTaskDetailView(APIView):
#     def get_object(self, pk):
#         return get_object_or_404(Participate_Task, pk=pk)
#     def get(self, request, pk, format=None):
#         participate_task = self.get_object(pk)
#         serializer = ParticipateTaskSerializer(participate_task)
#         return Response(serializer.data)
#
# ## [PAGE] Views ##
#
# class RaterMainView(APIView):
#     def get(self, request):
#         queryset = Parsing_Data.objects.all()
#         serializer = RaterMainTaskSerializer(queryset, many=True)
#         return Response(serializer.data)