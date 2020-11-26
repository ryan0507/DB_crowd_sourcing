from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(Task)
admin.site.register(User)
admin.site.register(Original_Data_Type)
admin.site.register(Parsing_Data)
admin.site.register(Participate_Task)