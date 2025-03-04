"""db URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from catalog.views import *

from rest_framework import routers
from adminUI import views
from raterUI import rater_views
from submitUI import submit_views
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token

router = routers.DefaultRouter()

# router.register("admin_main", views.AdminMainView, "admin_main")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include('catalog.urls')),
    path("adminUI/", include('adminUI.urls')),
    path("raterUI/", include('raterUI.urls')),
    path("submitUI/", include('submitUI.urls')),
    path("homeUI/", include('homeUI.urls')),
]
