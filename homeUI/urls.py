from django.urls import path
from .home_views import *

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    # Home [MAIN]
    path('', HomeMainView),
]