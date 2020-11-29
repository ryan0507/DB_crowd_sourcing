from django.urls import path
from .home_views import *



urlpatterns = [
    path('init/', give_sessionID),
    path('login/', Login),
    path('getuser/', GetUser),
]