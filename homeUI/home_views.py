import json
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import mysql.connector
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")



def select(query, bufferd=True):
  global dbconn;
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;

def give_sessionID(request):
    request.session["d"] = 1
    print("init",request.session.session_key)
    return redirect("/")


from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


def Login(request):
    print(request.session.session_key)
    data = json.loads(request.body)
    for i in select("SELECT MainID, ID, Name FROM USER WHERE ID = '{}' and Password = '{}'".format(data["ID"],data["Password"])):
        request.session['MainID'] = i[0]
        request.session['ID'] = i[1]
        request.session['Name'] = i[2]

        return JsonResponse({"MainID": i[0], "ID": i[1], "Name": i[2]})
    request.session['MainID'] = "-1"
    request.session['ID'] = "-1"
    request.session['Name'] = "-1"
    return JsonResponse({"MainID": "-1", "ID": "-1", "Name": "-1"}) # post에서 response에 status넣으면 안돼요!!

def GetUser(request):
    print(request.session.session_key)
    # return JsonResponse({"MainID": request.session['MainID'], "ID": request.session['ID'], "Name": request.session['Name']})
    return JsonResponse({})

def logout(request):
    try:
        del request.session['member_id']
    except KeyError:
        pass
    return HttpResponse("You're logged out.")