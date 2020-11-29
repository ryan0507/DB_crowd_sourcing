from django.shortcuts import render, get_object_or_404
import json
from django.http import JsonResponse
import mysql.connector
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")

def select(query, bufferd=True):
  global dbconn;
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;


def SubmitMainView(request):
    # print(request.session.session_key)
    result_lst = []
    for row in select("SELECT * FROM TASK"):
        tmp_dict = {"TaskID": row[0], "SubmissionPeriod": row[1], "TableName": row[2], "TaskSchema": row[3],
                    "Name": row[4], "Description": row[5], "Participate": False}
        for i in select("SELECT * FROM PARTICIPATE_TASK P WHERE P.TaskID = '{}' and P.SubmitterID = '{}'".format(row[0], request.session['MainID'])):
            tmp_dict["Participate"] = True
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)