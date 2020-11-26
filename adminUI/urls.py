from django.urls import path
from .views import *

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    # admin_main
    path('', AdminMainView),
    # # admin_taskInfo
    # path('<int:pk>/', TaskDetailView.as_view()),
    # # admin_userList
    # path('user/', UserListView.as_view()),
    # # user info (not finished)
    # path('user/<int:pk>/', UserDetailView.as_view()),
    # # original data type list (no need)
    # path('originaldatatype/', OriginalDataTypeView.as_view()),
    # # parsing data list (no need maybe)
    # path('parsingdata/', ParsingDataView.as_view()),
    # # admin_taskAdd
    # path('create/', CreatingTaskView.as_view()),
    # # admin_datatype_add
    # path('originaldatatype/create/', CreatingOriginalDataTypeView.as_view()),
    # # admin_tableSchema_add
    # path('taskschema/', CreatingTaskSchemaView.as_view()),
    # # participate task detail (error / not finished)
    # path('participatetask/', ParticipateTaskDetailView.as_view()),
    # path('ds/<int:question_id>/', detail, name='detail'),
]