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
    path('taskinfo2_2/<int:infoID>/', SubmitTaskInfo2_2)
]