from django.urls import path
from .submit_views import *



urlpatterns = [
    # Rater [MAIN]
    path('main1task/', SubmitMainView),
]