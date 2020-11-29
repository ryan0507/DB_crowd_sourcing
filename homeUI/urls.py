from django.urls import path
from .home_views import *



urlpatterns = [
    path('login/', Login),
    path('getuser/', GetUser),
]