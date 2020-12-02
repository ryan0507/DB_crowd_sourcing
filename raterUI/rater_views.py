from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import mysql.connector
import json
from datetime import date

DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = "111111"
DB_DATABASE = "DB_test"

def select(dbconn, query, bufferd=True):
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;

def select(dbconn, query, bufferd=True):
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;

def selectDetail(dbconn, query, thisID, buffered=True):

    cursor = dbconn.cursor(buffered=buffered);
    cursor.execute(query, thisID)
    result = cursor.fetchall()
    #print("result : ", result)
    return result;

def merge(dbconn, query, values, buffered=True):

    try:
        cursor = dbconn.cursor(buffered=buffered);
        cursor.execute(query, values);
        dbconn.commit();
    except Exception as e:
        dbconn.rollback();
        raise e;

def RaterMainView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for row in select(dbconn, """SELECT P.SUBMISSIONID, T.NAME, P.FILENAME, P.SUBMISSIONDATE
                          FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
                          WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND P.P_NP = 'W'
                          AND P.ASSESSORID = '{}'""".format(request.session['MainID'])):
            tmp_dict = {"SubmissionID": row[0], "TaskName": row[1], "FileName": row[2], "SubmissionDate": str(row[3].date()) + " " + str(row[3].time())}
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def RaterMain2View(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for row in select(dbconn, """SELECT P.SUBMISSIONID, T.NAME, P.FILENAME, P.P_NP
                          FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
                          WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND NOT P.P_NP = 'W'
                         AND P.ASSESSORID = '{}'""".format(request.session['MainID'])):
            tmp_dict = {"SubmissionID": row[0], "TaskName": row[1], "FileName": row[2], "P_NP": row[3]}
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def RaterTaskDetailView(request, submissionID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        list_arg = [submissionID]
        sql = """SELECT P.SUBMISSIONID, T.DESCRIPTION, T.TASKTHRESHOLD, P.STARTDATE,
                P.ENDDATE, T.TABLENAME, T.TASKSCHEMA, O.ORIGINSCHEMA, P.QUALASSESSMENT, 
                P.P_NP, T.NAME, P.SUBMISSIONNUMBER, O.MAPPING, O.ORIGINALTYPEID, P.QUANASSESSMENT, P.FileName
                FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
                WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND P.SUBMISSIONID = %s AND NOT P.P_NP = 'W'
                AND P.ASSESSORID = '{}'""".format(request.session['MainID'])
        result_lst = []
        for row in selectDetail(dbconn, sql, list_arg):
            tmp_dict = {"SubmissionID": row[0], "TaskDescription": row[1], "TaskThreshold": row[2],
                        "StartDate": row[3],
                        "EndDate": row[4], "TableName": row[5], "TaskSchema": row[6], "OriginSchema": row[7],
                        "QualAssessment": round(row[8],2), "P_NP": row[9], "TaskName": row[10], "SubmissionNumber": row[11],
                        "OriginSchemaMapping": row[12], "OriginTypeID": row[13], "QuanAssessment": round(row[14],2), "FileName" : row[15]}
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def RaterFileDetailView(request, submissionID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        list_arg = [submissionID]
        sql = """SELECT P.SUBMISSIONID, T.DESCRIPTION, T.TASKTHRESHOLD, P.STARTDATE,
                P.ENDDATE, T.TABLENAME, T.TASKSCHEMA, O.ORIGINSCHEMA, P.QUANASSESSMENT, 
                T.NAME, P.SUBMISSIONNUMBER, O.MAPPING, O.ORIGINALTYPEID, P.ASSESSORID, P.FileName
                FROM TASK AS T, ORIGINAL_DATA_TYPE AS O, PARSING_DATA AS P
                WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND P.SUBMISSIONID = %s AND P_NP = 'W'
                AND P.ASSESSORID = '{}'""".format(request.session['MainID'])
        result_lst = []
        for row in selectDetail(dbconn, sql, list_arg):
            tmp_dict = {"SubmissionID": row[0], "TaskDescription": row[1], "TaskThreshold": row[2],
                        "StartDate": row[3],
                        "EndDate": row[4], "TableName": row[5], "TaskSchema": row[6], "OriginSchema": row[7],
                        "QuanAssessment": round(row[8],2), "TaskName": row[9], "SubmissionNumber": row[10],
                        "OriginSchemaMapping": row[11], "OriginTypeID": row[12], "FileName" : row[14]}
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def RaterChangeInfoView(request):
    tmp_dict = {"ID": "Error", "Password": "Error", "Name": "Error", "Gender": "Error",
                "Address": "Error", "DateOfBirth": "Error", "PhoneNumber": "Error"}
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        r = select(dbconn,"SELECT * FROM USER WHERE MainID = '{}'".format(request.session["MainID"]))
        for t in r:
            tmp_dict["ID"] = t[1]
            tmp_dict["Password"] = t[2]
            tmp_dict["Name"] = t[3]
            tmp_dict["Gender"] = t[4]
            tmp_dict["Address"] = t[5]
            tmp_dict["DateOfBirth"] = t[6]
            tmp_dict["PhoneNumber"] = t[7]
            return JsonResponse(tmp_dict)
    except Exception as e:
        return JsonResponse(tmp_dict)
    finally:
        dbconn.close();