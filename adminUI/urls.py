from django.urls import path
from .views import *

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    # admin_main
    path('', AdminMainView),
    # admin_taskAdd
    path('create/', TaskAddView),
    # admin_taskInfo
    path('<int:infoID>/', TaskInfoView),
    # admin_typeAdd
    path('<int:infoID>/create/', TypeAddView),
    # admin_fileDetail
    path('<int:infoID>/<int:fileID>/', FileDetailView),
    # admin_userList
    path('user/', UserListView),
    # admin_presenterDetail
    path('user/submitter/<int:su_ID>', PresenterDetailView),
    # admin_estimatorDetail
    path('user/assessor/<int:as_ID>', EstimatorDetailView),
    # admin_alterPassword
    path('alterpw/', alterPassword),
    # download_csv_file
    path('downloadcsv/<int:TaskID>',download_csv_data)
]