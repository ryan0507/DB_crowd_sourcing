from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import mysql.connector
import json
from datetime import date
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")

def select(query, bufferd=True):
  global dbconn;
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;

def selectDetail(query, thisID, buffered=True):

    global dbconn;
    cursor = dbconn.cursor(buffered=buffered);
    cursor.execute(query, thisID)
    result = cursor.fetchall()
    #print("result : ", result)
    return result;

def merge(query, values, buffered=True):

    global dbconn;
    try:
        cursor = dbconn.cursor(buffered=buffered);
        cursor.execute(query, values);
        dbconn.commit();
    except Exception as e:
        dbconn.rollback();
        raise e;


def RaterMainView(request):
    result_lst = []
    for row in select("""SELECT P.SUBMISSIONID, T.NAME, P.FILENAME, P.SUBMISSIONDATE
                      FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
                      WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND P.P_NP = 'W'"""):
        tmp_dict = {"SubmissionID": row[0], "TaskName" : row[1], "FileName" : row[2], "SubmissionDate" : row[3]}
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)

def RaterMain2View(request):
    result_lst = []
    for row in select("""SELECT P.SUBMISSIONID, T.NAME, P.FILENAME, P.P_NP
                      FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
                      WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND NOT P.P_NP = 'W'"""):
        tmp_dict = {"SubmissionID": row[0], "TaskName" : row[1], "FileName" : row[2], "PassNonpass" : row[3]}
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)

def RaterTaskDetailView(request, submissionID):
    list_arg = [submissionID]
    sql = """SELECT P.SUBMISSIONID, T.DESCRIPTION, T.TASKTHRESHOLD, P.STARTDATE,
            P.ENDDATE, T.TABLENAME, T.TASKSCHEMA, O.ORIGINSCHEMA, P.QUALASSESSMENT, 
            P.P_NP, T.NAME, P.SUBMISSIONNUMBER, O.MAPPING, O.ORIGINALTYPEID
            FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
            WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND P.SUBMISSIONID = %s AND NOT P_NP = 'W'"""
    result_lst = []
    for row in selectDetail(sql, list_arg):
        tmp_dict = {"SubmissionID": row[0], "TaskDescription": row[1], "TaskThreshold": row[2], "StartDate": row[3],
                    "EndDate": row[4], "TableName": row[5], "TaskSchema": row[6], "OriginSchema": row[7],
                    "QualAssessment": row[8], "P_NP": row[9], "TaskName" : row[10], "SubmissionNumber" : row[11],
                    "OriginSchemaMapping" : row[12], "OriginTypeID" : row[13]}
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)