from django.urls import path
from .submit_views import *

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    # Rater [MAIN]
    path('main1task/', SubmitMainView),
]