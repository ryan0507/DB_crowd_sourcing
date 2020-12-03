from django.urls import path
from .submit_views import *

urlpatterns = [
    # Rater [MAIN]
    path('main1task/', SubmitMainView),
    path('main2task/',SubmitMain2View),
    path('main2_2task/',SubmitMain2_2View),
    path('changeinfo/',SubmitChangeInfo),
    path('taskinfo1/<int:infoID>/',SubmitTaskInfo1),
    path('gettask/',GetTask),
    path('jointask/',JoinTask),
    path('taskinfo2/<int:infoID>/', SubmitTaskInfo2),
    path('taskinfo2_2/<int:infoID>/', SubmitTaskInfo2_2),
    path('taskinfo2_3/<int:infoID>/', SubmitTaskInfo2_3),
    path('taskinfo2_4/<int:infoID>/', SubmitTaskInfo2_4),
    path('downloadcsvfile/<int:SubmissionID>/', download_csv_data),
    path('getsubtime/<int:infoID>/', getSubTime),
    path('postfile/',postFile),
    path('getresult/<int:id>/',getResult)
]