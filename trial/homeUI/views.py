from django.shortcuts import render, get_object_or_404

# Create your views here.

from .models import *

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import *



class UserListView(APIView):
    def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
