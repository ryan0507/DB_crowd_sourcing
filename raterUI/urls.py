from django.urls import path
from .rater_views import *

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    # [MAIN]
    path('', RaterMainViesw),
    # [MAIN2]
    path('main2/', RaterMain2View),
    # [TaskDetail]
    path('taskDetail/<int:submissionID>/', RaterTaskDetailView),
    # [FileDetail]
    path('fileDetail/<int:submissionID>/', RaterFileDetailView),
    # [ChangeInfo]
    path('changeInfo/', RaterChangeInfoView),
]