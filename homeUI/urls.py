from django.urls import path
from .views import *

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    path('', UserListView.as_view()),

]