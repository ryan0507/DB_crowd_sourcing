from django.urls import path
from .home_views import *



urlpatterns = [
    path('login/', Login),
    path('getuser/', GetUser),
    path('logout/', logout),
    path('signup/', UserAddView),
    path('id/', GetId),
    path('mainid/', GetMainId),
]