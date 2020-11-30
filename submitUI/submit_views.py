from django.shortcuts import render, get_object_or_404
import json
from django.http import JsonResponse
import mysql.connector
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = "111111"
DB_DATABASE = "DB_test"
def select(dbconn, query, bufferd=True):
    cursor = dbconn.cursor(buffered=bufferd);
    cursor.execute(query);
    return cursor;

def merge_bulk(dbconn, query, values, bufferd=True):
    try:
        cursor = dbconn.cursor(buffered=bufferd);
        cursor.executemany(query, values);
        dbconn.commit();
    except Exception as e:
        dbconn.rollback();
        raise e;

def selectDetail(dbconn, query, thisID, buffered=True):

    cursor = dbconn.cursor(buffered=buffered);
    cursor.execute(query, thisID)
    result = cursor.fetchall()
    #print("result : ", result)
    return result;

def SubmitMainView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for row in select(dbconn,"SELECT * FROM TASK"):
            tmp_dict = {"TaskID": row[0], "SubmissionPeriod": row[1], "TableName": row[2], "TaskSchema": row[3],
                        "Name": row[4], "Description": row[5], "Participate": ""}
            for i in select(dbconn,
                            "SELECT Pass FROM PARTICIPATE_TASK P WHERE P.TaskID = '{}' and P.SubmitterID = '{}'".format(row[0],
                                                                                                                        request.session[
                                                                                                                            'MainID'])):
                if i[0] == "P":
                    tmp_dict["Participate"] = "참여중인 태스크"
                else:
                    tmp_dict["Participate"] = "참여 신청 완료"
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();


def SubmitMain2View(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for i in select(dbconn,"""SELECT T.TaskID, T.Name, T.Description  FROM PARTICIPATE_TASK P, TASK T 
        WHERE P.TaskID = T.TaskID and P.Pass = 'P' and P.SubmitterID = '{}'""".format(request.session['MainID'])):
            tmp_dict = {"TaskID": "Error", "Name": "Error", "Description": "Error", "NSubmittedFile": "Error",
                        "NpassedFile": "Error", "avgRate": "Error"}
            tmp_dict["TaskID"], tmp_dict["Name"], tmp_dict["Description"] = i[0], i[1], i[2]
            tmp_dict["NSubmittedFile"] = list(select(dbconn,"""
            SELECT COUNT(*) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O, TASK T 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and O.TaskID = T.TaskID
             and P.SubmitterID = '{}'and T.TaskID = {}""".format(request.session['MainID'], i[0])))[0][0]

            tmp =  list(select(dbconn,"""SELECT COUNT(*) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O, TASK T 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and O.TaskID = T.TaskID
             and P.SubmitterID = '{}' and P.P_NP = 'P'and T.TaskID = {}""".format(request.session['MainID'], i[0])))[0]

            tmp_dict["NpassedFile"] = tmp[0]
            print(tmp_dict)

            tmp = list(select(dbconn, """SELECT AVG(QuanAssessment), AVG(QualAssessment) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O, TASK T 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and O.TaskID = T.TaskID
            and P.SubmitterID = '{}' and T.TaskID = {} and P.P_NP != 'W'""".format(request.session['MainID'],i[0])))[0]


            try:
                tmp_dict["avgRate"] = round((tmp[0] + tmp[1]) / 2, 2)
            except:
                tmp_dict["avgRate"] = 0
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def SubmitMain2_2View(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        rate = list(select(dbconn,"""SELECT AVG(QuanAssessment), AVG(QualAssessment) FROM PARSING_DATA P
        WHERE P.SubmitterID = '{}' and P.P_NP != 'W'""".format(request.session['MainID'])))[0]
        tmp_dict = {"score" : round((rate[0] + rate[1]) / 2, 2)}
        return JsonResponse(tmp_dict)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();


def SubmitChangeInfo(request):
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

def SubmitTaskInfo1(request, infoID):
    tmp_dict = {"name": "Error", "tablename": "Error", "description": "Error",
                "pass_s": "Error", "period": "Error", "schema": [], "original_schema":[], "participate" : "P"}
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        r = select(dbconn,"""SELECT Name, TableName, Description, TaskThreshold, SubmissionPeriod, TaskSchema
          FROM TASK T  WHERE T.TaskID = {}""".format(infoID))
        for t in r:
            tmp_dict["name"] = t[0]
            tmp_dict["tablename"]= t[1]
            tmp_dict["description"] = t[2]
            tmp_dict["pass_s"] = t[3]
            tmp_dict["period"] = t[4]
            other_r = select(dbconn, "SELECT Pass FROM PARTICIPATE_TASK  WHERE TaskID = {} and SubmitterID = '{}'".format( infoID, request.session["MainID"]))
            tmp_dict["participate"] = "N"
            for other_t in other_r:
                print(other_t)
                if other_t == "P":
                    tmp_dict["participate"] = "P"
                elif other_t == "W":
                    tmp_dict["participate"] = "W"

            tmp = t[5].split("%")
            tmp_dict["schema"] = [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]

            r2 = select(dbconn,"""SELECT OriginSchema, Mapping FROM ORIGINAL_DATA_TYPE 
            WHERE TaskID = '{}'""".format(infoID))
            for t2 in r2:
                tmp = t2[1].split("%")
                tmp_dict2 = { "name" : t2[0], "schema" : [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]}
                tmp_dict["original_schema"].append(tmp_dict2)
        request.session["TaskName"] = tmp_dict["name"]
        request.session["TaskID"] = infoID
        return JsonResponse(tmp_dict)
    except Exception as e:
        print(e)
        tmp_dict = {"name": "Error", "tablename": "Error", "description": "Error",
                    "pass_s": "Error", "period": "Error", "schema": [], "original_schema": [], "participate": "P"}
        return JsonResponse(tmp_dict)
    finally:
        dbconn.close();

def GetTask(request):
    try:
        return JsonResponse({"Name": request.session['TaskName']})
    except Exception as e:
        return JsonResponse({"Name": "Error"})

def JoinTask(request):
    try:
        TaskID = request.session["TaskID"]
        MainID = request.session["MainID"]
        Pass = "W"
        merge_bulk(dbconn, "INSERT INTO PARTICIPATE_TASK VALUES (%s, %s, %s)", [(TaskID, MainID, Pass)])
        del request.session["TaskID"]
        del request.session["TaskName"]
        return JsonResponse({"result" : "success"})
    except:
        return JsonResponse({"result": "fail"})

def SubmitTaskInfo2(request, infoID):
    tmp_dict = {"name": "Error", "tablename": "Error", "description": "Error",
                "pass_s": "Error", "period": "Error", "schema": [], "original_schema":[], "participate" : "P"}
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        r = select(dbconn,"""SELECT Name, TableName, Description, TaskThreshold, SubmissionPeriod, TaskSchema
          FROM TASK T  WHERE T.TaskID = {}""".format(infoID))
        for t in r:
            tmp_dict["name"] = t[0]
            tmp_dict["tablename"]= t[1]
            tmp_dict["description"] = t[2]
            tmp_dict["pass_s"] = t[3]
            tmp_dict["period"] = t[4]
            other_r = select(dbconn, "SELECT Pass FROM PARTICIPATE_TASK  WHERE TaskID = {} and SubmitterID = '{}'".format( infoID, request.session["MainID"]))
            tmp_dict["participate"] = "N"
            for other_t in other_r:
                print(other_t)
                if other_t == "P":
                    tmp_dict["participate"] = "P"
                elif other_t == "W":
                    tmp_dict["participate"] = "W"

            tmp = t[5].split("%")
            tmp_dict["schema"] = [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]

            r2 = select(dbconn,"""SELECT OriginSchema, Mapping, OriginalTypeID FROM ORIGINAL_DATA_TYPE 
            WHERE TaskID = '{}'""".format(infoID))
            for t2 in r2:
                tmp = t2[1].split("%")
                tmp_dict2 = { "name" : t2[0],
                              "schema" : [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]}
                tmp_dict["original_schema"].append(tmp_dict2)
        request.session["TaskName"] = tmp_dict["name"]
        request.session["TaskID"] = infoID
        return JsonResponse(tmp_dict)
    except Exception as e:
        print(e)
        tmp_dict = {"name": "Error", "tablename": "Error", "description": "Error",
                    "pass_s": "Error", "period": "Error", "schema": [], "original_schema": [], "participate": "P"}
        return JsonResponse(tmp_dict)
    finally:
        dbconn.close();

def SubmitTaskInfo2_2(request, infoID): # submit info
    # tmp_dict = {"originalTypeID" : "Error", "submitNum" : "Error", "submitDate" : "Error", "submitFileName" : "Error",
    #             "quanScore": "Error", "qualScore" : "Error", "passNonpass" : "Error"}
    result_dict = {"data":[]}
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        sql = """ SELECT P.ORIGINALTYPEID, P.SUBMISSIONNUMBER, P.SUBMISSIONDATE, P.FILENAME,
                P.QUANASSESSMENT, P.QUALASSESSMENT, P.P_NP 
                FROM PARSING_DATA AS P, ORIGINAL_DATA_TYPE AS O
                WHERE O.ORIGINALTYPEID = P.ORIGINALTYPEID 
                AND P.SUBMITTERID = '{}' AND O.TASKID = {}""".format(request.session['MainID'], infoID)
        r = select(dbconn, sql)
        for t in r:
            tmp_dict = {}
            tmp_dict["originalTypeID"] = t[0]
            tmp_dict["submitNum"]= t[1]
            tmp_dict["submitDate"] = t[2]
            tmp_dict["submitFileName"] = t[3]
            tmp_dict["quanScore"] = t[4]
            tmp_dict["qualScore"] = t[5]
            tmp_dict["passNonpass"] = t[6]
            result_dict["data"].append(tmp_dict)

        request.session["TaskID"] = infoID
        return JsonResponse(result_dict)
    except Exception as e:
        print(e)
        tmp_dict = {"originalTypeID": "Error", "submitNum": "Error", "submitDate": "Error", "submitFileName": "Error",
                    "quanScore": "Error", "qualScore": "Error", "passNonpass": "Error"}
        return JsonResponse(tmp_dict)
    finally:
        dbconn.close();

def SubmitTaskInfo2_3(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for i in select(dbconn,"""SELECT T.TaskID, T.Name, T.Description  FROM PARTICIPATE_TASK P, TASK T 
        WHERE P.TaskID = T.TaskID and P.Pass = 'P' and P.SubmitterID = '{}' and T.TaskID ={}""".format(request.session['MainID'], infoID)):
            tmp_dict = {"TaskID": "Error", "Name": "Error", "Description": "Error", "NSubmittedFile": "Error",
                        "NpassedFile": "Error", "avgRate": "Error"}
            tmp_dict["TaskID"], tmp_dict["Name"], tmp_dict["Description"] = i[0], i[1], i[2]
            tmp_dict["NSubmittedFile"] = list(select(dbconn,"""
            SELECT COUNT(*) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O, TASK T 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and O.TaskID = T.TaskID
             and P.SubmitterID = '{}'and T.TaskID = {}""".format(request.session['MainID'], i[0])))[0][0]

            tmp =  list(select(dbconn,"""SELECT COUNT(*) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O, TASK T 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and O.TaskID = T.TaskID
             and P.SubmitterID = '{}' and P.P_NP = 'P'and T.TaskID = {}""".format(request.session['MainID'], i[0])))[0]

            tmp_dict["NpassedFile"] = tmp[0]
            print(tmp_dict)

            tmp = list(select(dbconn, """SELECT AVG(QuanAssessment), AVG(QualAssessment) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O, TASK T 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and O.TaskID = T.TaskID
            and P.SubmitterID = '{}' and T.TaskID = {} and P.P_NP != 'W'""".format(request.session['MainID'],i[0])))[0]


            try:
                tmp_dict["avgRate"] = round((tmp[0] + tmp[1]) / 2, 2)
            except:
                tmp_dict["avgRate"] = 0
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def SubmitTaskInfo2_4(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        rate = list(select(dbconn,"""SELECT AVG(QuanAssessment), AVG(QualAssessment) 
        FROM PARSING_DATA P, ORIGINAL_DATA_TYPE AS O
        WHERE P.SubmitterID = '{}' and P.P_NP != 'W' and O.ORIGINALTYPEID = P.ORIGINALTYPEID
        AND TASKID = {}""".format(request.session['MainID'], infoID)))[0]
        tmp_dict = {"score" : round((rate[0] + rate[1]) / 2, 2)}
        return JsonResponse(tmp_dict)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();




