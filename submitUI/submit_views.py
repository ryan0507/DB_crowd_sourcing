from django.shortcuts import render, get_object_or_404
import pandas as pd
import numpy as np
import json
import csv, random
from datetime import datetime, timedelta
from django.utils.encoding import smart_str
from django.http import JsonResponse, HttpResponse
import mysql.connector
# dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = '1246team!'
DB_DATABASE = "DB_test"
def select(dbconn, query, bufferd=True):
    cursor = dbconn.cursor(buffered=bufferd);
    cursor.execute(query);
    return cursor;

def merge_bulk(dbconn, query, values, bufferd=True):
    try:
        cursor = dbconn.cursor(buffered=bufferd);
        cursor.executemany(query, values);
    except Exception as e:
        dbconn.rollback();
        raise e;


def selectDetail(dbconn, query, thisID, buffered=True):

    cursor = dbconn.cursor(buffered=buffered);
    cursor.execute(query, thisID)
    result = cursor.fetchall()
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
            SELECT COUNT(*) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O WHERE O.OriginalTypeID =  P.OriginalTypeID
             and P.SubmitterID = '{}'and O.TaskID = {}""".format(request.session['MainID'], i[0])))[0][0]

            tmp =  list(select(dbconn,"""SELECT COUNT(*) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O WHERE O.OriginalTypeID =  P.OriginalTypeID 
             and P.SubmitterID = '{}' and P.P_NP = 'P'and O.TaskID = {}""".format(request.session['MainID'], i[0])))[0]

            tmp_dict["NpassedFile"] = tmp[0]

            tmp = list(select(dbconn, """SELECT AVG(QuanAssessment), AVG(QualAssessment) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and P.SubmitterID = '{}' 
            and O.TaskID = {} and P.P_NP != 'W'""".format(request.session['MainID'],i[0])))[0]


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
                if other_t[0] == "P":
                    tmp_dict["participate"] = "P"
                elif other_t[0] == "W":
                    tmp_dict["participate"] = "W"

            tmp = t[5].split("%")
            tmp_dict["schema"] = [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]

            r2 = select(dbconn,"""SELECT OriginSchema, Mapping, OriginalTypeID FROM ORIGINAL_DATA_TYPE 
            WHERE TaskID = '{}'""".format(infoID))
            for t2 in r2:
                tmp = t2[1].split("%")
                tmp_dict2 = { "name" : "ID " +  str(t2[2]) + ": " + t2[0], "schema" : [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]}
                tmp_dict["original_schema"].append(tmp_dict2)
        request.session["TaskName"] = tmp_dict["name"]
        request.session["TaskID"] = infoID
        return JsonResponse(tmp_dict)
    except Exception as e:
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
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        TaskID = request.session["TaskID"]
        MainID = request.session["MainID"]
        Pass = "W"
        merge_bulk(dbconn, "INSERT INTO PARTICIPATE_TASK VALUES (%s, %s, %s)", [(TaskID, MainID, Pass)])
        del request.session["TaskID"]
        del request.session["TaskName"]
        dbconn.commit()
        return JsonResponse({"result" : "success"})
    except:
        dbconn.rollback()
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
                tmp_dict2 = { "name" : "ID " +  str(t2[2]) + ": " + t2[0],
                              "schema" : [ { "Big" : tmp[2*i],"small" : tmp[2*i+1]} for i in range(len(tmp)//2)]}
                tmp_dict["original_schema"].append(tmp_dict2)
        request.session["TaskName"] = tmp_dict["name"]
        request.session["TaskID"] = infoID
        return JsonResponse(tmp_dict)
    except Exception as e:
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
        sql = """ SELECT O.OriginSchema, P.SUBMISSIONNUMBER, P.SUBMISSIONDATE, P.FILENAME,
                         P.NumberOfTUple, P.QUANASSESSMENT, P.QUALASSESSMENT, P.P_NP, P.SubmissionID
                FROM PARSING_DATA AS P, ORIGINAL_DATA_TYPE AS O
                WHERE O.ORIGINALTYPEID = P.ORIGINALTYPEID 
                AND P.SUBMITTERID = '{}' AND O.TASKID = {}""".format(request.session['MainID'], infoID)
        r = select(dbconn, sql)
        for t in r:
            tmp_dict = {}
            tmp_dict["originalTypeID"] = t[0]
            tmp_dict["submitNum"]= t[1]
            tmp_dict["submitDate"] = t[2]
            tmp_dict["submitFileName"] = [t[3],str(t[8])]
            tmp_dict["Ntuple"] = t[4]
            tmp_dict["quanScore"] = round(t[5],2)
            tmp_dict["qualScore"] = round(t[6],2)
            tmp_dict["passNonpass"] = t[7]

            result_dict["data"].append(tmp_dict)

        request.session["TaskID"] = infoID
        return JsonResponse(result_dict)
    except Exception as e:
        tmp_dict = {"originalTypeID": "Error", "submitNum": "Error", "submitDate": "Error", "submitFileName": "Error",
                    "Ntuple": "Error", "quanScore": "Error", "qualScore": "Error", "passNonpass": "Error"}
        return JsonResponse(tmp_dict)
    finally:
        dbconn.close();




def SubmitTaskInfo2_3(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for i in select(dbconn,"""SELECT T.TaskID, T.Name, T.Description, SubmissionPeriod  FROM PARTICIPATE_TASK P, TASK T 
        WHERE P.TaskID = T.TaskID and P.Pass = 'P' and P.SubmitterID = '{}' and T.TaskID ={}""".format(request.session['MainID'], infoID)):
            tmp_dict = {"TaskID": "Error", "Name": "Error", "Description": "Error", "NSubmittedFile": "Error",
                        "NpassedFile": "Error", "avgRate": "Error"}
            tmp_dict["TaskID"], tmp_dict["Name"], tmp_dict["Description"] = i[0], i[1], i[2]
            tmp = list(select(dbconn,"""
            SELECT COUNT(*),SUM(NumberOfTuple)  FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and P.SubmitterID = '{}'and O.TaskID = {}""".format(request.session['MainID'], i[0])))[0]
            tmp_dict["NSubmittedFile"] = tmp[0] if tmp[0] else 0
            tmp_dict["NSubmittedTuple"] = tmp[1] if tmp[1] else 0
            tmp =  list(select(dbconn,"""SELECT COUNT(*),SUM(NumberOfTuple), MAX(SubmissionDate) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O 
            WHERE O.OriginalTypeID =  P.OriginalTypeID and P.SubmitterID = '{}' and P.P_NP = 'P'and O.TaskID = {}""".format(request.session['MainID'], i[0])))[0]

            tmp_dict["NpassedFile"] = tmp[0] if tmp[0] else 0
            tmp_dict["NpassedTuple"] = tmp[1] if tmp[1] else 0
            P_time = tmp[2] if tmp[2] else datetime(1,1,1,0,0,0)

            tmp = next(select(dbconn, """SELECT COUNT(*),SUM(NumberOfTuple), MAX(SubmissionDate) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O 
                                    WHERE O.OriginalTypeID =  P.OriginalTypeID and P.SubmitterID = '{}' and P.P_NP = 'W'and O.TaskID = {}""".format(
                request.session['MainID'], i[0])))

            tmp_dict["NwaitFile"] = tmp[0] if tmp[0] else 0
            tmp_dict["NwaitTuple"] = tmp[1] if tmp[1] else 0
            W_time = tmp[2] if tmp[2] else datetime(1,1,1,0,0,0)

            tmp_dict["Submissionthreshold"] = max([P_time,W_time]) + timedelta(days = int(i[3]))
            tmp_dict["SubOK"] = tmp_dict["Submissionthreshold"] <= datetime.now()

            tmp_dict["Submissionthreshold"] = str(tmp_dict["Submissionthreshold"].date()) + " " + str(tmp_dict["Submissionthreshold"].time())

            tmp = list(select(dbconn, """SELECT AVG(QuanAssessment), AVG(QualAssessment) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O 
            WHERE O.OriginalTypeID =  P.OriginalTypeID
            and P.SubmitterID = '{}' and O.TaskID = {} and P.P_NP != 'W'""".format(request.session['MainID'],i[0])))[0]
            try:
                tmp_dict["avgRate"] = round((tmp[0] + tmp[1]) / 2, 2)
            except:
                tmp_dict["avgRate"] = 0
            return JsonResponse(tmp_dict)
    except Exception as e:
        return JsonResponse({}, safe=False)
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




def download_csv_data(request, SubmissionID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        OriginalTypeID, P_NP = next(select(dbconn,"SELECT OriginalTypeID, P_NP FROM PARSING_DATA WHERE SubmissionID = {}".format(SubmissionID)))
        TaskID = next(select(dbconn, "SELECT TaskID FROM ORIGINAL_DATA_TYPE WHERE OriginalTypeID = {}".format(OriginalTypeID)))[0]

        TableName, TaskSchema = next(select(dbconn, "SELECT TableName, TaskSchema FROM TASK WHERE TaskID = {}".format(TaskID)))

        if P_NP == "NP":
            return HttpResponse("NonPass를 받은 파일은 삭제됩니다.", status=201)
        if P_NP == "W":
            TableName = TableName + "_W"

        # response content type
        response = HttpResponse(status=200,content_type='text/csv')
        # decide the file name
        response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(TableName)
        writer = csv.writer(response, csv.excel)
        # response.write(u'\ufeff'.encode('utf8'))

        # write the headers
        writer.writerow([smart_str(i) for i in TaskSchema.split("%")[::2]])
        print([smart_str(i) for i in TaskSchema.split("%")[::2]])
        data = select(dbconn, "SELECT * FROM {} WHERE SubmissionID = {}".format(TableName,SubmissionID))

        for row in data:
            writer.writerow(row[1:])
        return response
    except Exception as e:
        return HttpResponse("오류가 발생했습니다.",status=202)
    finally:
        dbconn.close();

def getSubTime(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        rate = next(select(dbconn,"""SELECT MAX(SubmissionNumber) FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O 
        WHERE P.OriginalTypeID = O.OriginalTypeID and SubmitterID = '{}' and TaskID = {}""".format(
            request.session["MainID"], infoID
        )))
        return JsonResponse({"subtime" : rate[0] + 1 if rate[0] else 1})
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();

def postFile(request):
    try:
        post_data = {i: j[0] for i, j in dict(request.POST).items()}
        post_data["OriginalID"] = post_data["OriginalID"].split(":")[0].replace("ID ", "")
        fileName = str(request.FILES["file"])

        if fileName[-3:] != "csv":
            return JsonResponse({"state": 202, "message": "csv파일만을 제출해야합니다."})
        data = [i.decode('utf-8').strip().split(",") for i in request.FILES['file']]
        data = pd.DataFrame(data[1:],columns=data[0])

        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        schema = next(select(dbconn,"SELECT Mapping FROM ORIGINAL_DATA_TYPE WHERE OriginalTypeID = {}".format(post_data["OriginalID"])))
        TableName, type = next(select(dbconn,"SELECT TableName, TaskSchema FROM TASK WHERE TaskID = {}".format(post_data["TaskID"])))
        schema = schema[0].split("%")
        col_length = len(schema)//2
        type = type.split("%")
        schema = dict(zip(schema[::2],schema[1::2]))
        type = dict(zip(type[::2],type[1::2]))
        col = data.columns
        insert_type = ""
        for i in schema.keys():
            print(i)
            if i not in col:
                return JsonResponse({"state": "202", "message": "제출한 파일이 원본 스키마와 맞지 않습니다."})
            if type[schema[i]] == "float":
                try:
                    data[i] = data[i].astype(float)
                    insert_type += "%s,"
                except:
                    return JsonResponse({"state": "202", "message": "제출한 파일이 스키마의 데이터 타입과 맞지 않습니다."})
            elif type[schema[i]] == "integer":
                try:
                    data[i] = data[i].astype(float)
                    tmp.dropna().astype(int)
                    data[i] = data[i].round()
                    insert_type += "%s,"
                except Exception as e:
                    print(e)
                    return JsonResponse({"state": "202", "message": "제출한 파일이 스키마의 데이터 타입과 맞지 않습니다."})
            elif type[schema[i]] == "boolean":
                try:
                    insert_type += "%s,"
                    data[i] = data[i].astype(float)
                    tmp = data[i]
                    if tmp[ ~((tmp == 0) | (tmp == 1))].notna().sum() != 0:
                        return JsonResponse({"state": "202", "message": "제출한 파일이 스키마의 데이터 타입과 맞지 않습니다."})
                    data[i] = data[i].round()
                except:
                    return JsonResponse({"state": "202", "message": "제출한 파일이 스키마의 데이터 타입과 맞지 않습니다."})
            elif type[schema[i]] == "string":
                try:
                    data[i] = data[i].astype(str)
                    insert_type += "%s,"
                except:
                    return JsonResponse({"state": "202", "message": "제출한 파일이 스키마의 데이터 타입과 맞지 않습니다."})
            else:
                raise Exception
        data = data.rename(columns=schema)
        score, data = CalCulateScore_ReturnRefinedDF(data, post_data["TaskID"], request.session["MainID"])
        if score:
            pass
        else:
            raise Exception

        lst = list(select(dbconn, "SELECT MainID FROM USER WHERE MainID LIKE 'as %'"))
        print(lst)
        rater = random.sample(lst,1)[0][0]

        merge_bulk(dbconn,"""INSERT INTO PARSING_DATA(OriginalTypeID, SubmitterID, AssessorID, SubmissionNumber,
                          StartDate, EndDate, FileName, NumberOfTuple, QuanAssessment, P_NP, SubmissionDate, QualAssessment) VALUES 
                          (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                   [(int(post_data["OriginalID"]), request.session["MainID"], rater
                     ,int(post_data["SubmissionNumber"]), post_data["startDate"], post_data["endDate"], fileName,
                     score["RestRow"], float(score["Score"]), "W", str(datetime.now()),0)])
        key = next(select(dbconn,"SELECT LAST_INSERT_ID()"))[0]
        data["SubmissionID"] = key
        merge_bulk(dbconn,"INSERT INTO {} VALUES (%s, {})".format(TableName + "_W(" + ",".join(list(data.columns)) + ")", insert_type[:-1])
                   ,[tuple(i) for i in data.values])

        info = {"TotalColumn" : str(score["TotalColumn"]), "NullRow" : str(score["NullRow"]),
         "SelfDupRow" : str(score["SelfDupRow"]), "OtherDupRow" : str(score["OtherDupRow"]),
         "NullPercent": str(score["NullPercent"]), "TotalRow":str(score["TotalRow"]),
         "RestRow" : str(score["RestRow"]), "Score": str(round(score["Score"],3)),
         }

        id = random.randint(0,10000)
        request.session[id] = info
        print(request.session[id])
        dbconn.commit()
        return JsonResponse({"state": "200","message": str(id)})
    except Exception as e:
        print(e)
        dbconn.rollback()
        return JsonResponse({"state": "203", "message": "오류가 발생했습니다."})

    finally:
        dbconn.close()

# 점수 계산 방법: 아래 점수의 평균(만약 남은 행의 개수가 2000개 미만이면 가중치를 (2000-행개수) 만큼 늘린다. )
# 행개수 점수: max(10, 남은행개수 * 0.01)
# 자기중복 수: 10 - (0, (자기중복수 - 100) * 0.1, 10)
# 다른 row와 중복 수: 10 - (0, (자기중복수 - 1000) * 0.01, 10)
# null 행: 10 - (0, (null행수 - 100) * 0.01, 10)
# null 비율: (1 - null비율 * 0.5) * 10
def CalCulateScore_ReturnRefinedDF(data1, TaskID, MainID):
    """
    data1: 원본데이터를 pandas df형태로 넣으면 됨, 단, column이름을 태스크 column에 맞게 올바르게 갖고 있어야 한다.
    TaskID: 해당하는 TaskID
    MainID: 제출자의 MainID
    return:
        Info : {"NullRow": 전체가 null인 열(null비율 50%이상) 개수 , "SelfDupRow": 자기가 제출한 데이터 똑같은거 몇개 제출?, "OtherDupRow" : 다른 사람이 제출한 데이터와 중복개수
        , "NullPercent" : 남은 행 중에서 null 값 개수, "TotalRow": 전체 제출 row개수, "RestRow": 중복제거하고 남은 행개수, "TotalColumn" : 전체 열개수, "Score": 점수}
        data2: 중복제거되고 남은 데이터 -> Insert로 해당테이블에 넣으면 됨
    """
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        # NullRow기준(전체 50%이상 Null)
        Info = {"NullRow": 0, "SelfDupRow": 0, "OtherDupRow" : 0, "NullPercent" : 0, "TotalRow": 0, "RestRow": 0, "TotalColumn" : 0, "Score": 0}

        TableName, TaskSchema = next(select(dbconn,"SELECT TableName, TaskSchema FROM TASK WHERE TaskID ={}".format(TaskID)))
        TaskSchema = TaskSchema.split("%")[::2]
        TaskSchema = [i for i in TaskSchema if i in data1.columns]
        data1 = data1[[TaskSchema]]

        Info["TotalColumn"] = len(TaskSchema)
        Info["TotalRow"] = len(data1)
        data2 = data1[data1.notnull().mean(axis=1) > 0.5]
        Info["NullRow"] = len(data1) - len(data2)
        tmp = data2.round(4).duplicated()
        data2 = data2[~tmp]
        Info["SelfDupRow"] += tmp.sum()

        t1 = select(dbconn, "SELECT SubmitterID,{} FROM {} A, PARSING_DATA B WHERE A.SubmissionID = B.SubmissionID".format(",".join(TaskSchema), TableName)) ; t1 = pd.DataFrame(t1, columns= ["SubmitterID"] + TaskSchema)
        tmp = t1.iloc[:,1:].append(data2)
        dup = tmp.round(4).duplicated()
        data2 = tmp[~dup][len(t1):]
        dup_data = t1[tmp.round(4).duplicated(keep=False)[:len(t1)]]
        dup_data = dup_data["SubmitterID"] == MainID
        Info["SelfDupRow"] += dup_data.sum()
        Info["OtherDupRow"] = (~dup_data).sum()



        t1 = select(dbconn, "SELECT {} FROM {}_W A, PARSING_DATA B WHERE A.SubmissionID = B.SubmissionID and SubmitterID = '{}'".format(",".join(TaskSchema), TableName,MainID))
        t1 = pd.DataFrame(t1, columns=TaskSchema)
        tmp = t1.append(data2)
        dup = tmp.round(4).duplicated()
        data2 = tmp[~dup][len(t1):]
        Info["SelfDupRow"] += dup.sum()

        Info["NullPercent"] = data2.isnull().values.mean()
        Info["RestRow"] = len(data2)


        score = np.array([Info["RestRow"] * 0.01, 10 - (Info["SelfDupRow"] - 100) * 0.1, 10 - (Info["OtherDupRow"] - 1000) * 0.01,
                  10 - (Info["NullRow"] - 100) * 0.01], (1- Info["NullPercent"] * 0.5) * 10)
        score = np.clip(score,0,10)

        if Info["RestRow"] < 2000:
            weight = np.ones(4)
            weight[0] = (2000 - Info["RestRow"])
        else:
            weight = np.ones(4)
        weight = weight / weight.sum()
        score = (score * weight).sum()
        Info["Score"] = score

        return (Info, data2)
    except:
        Info = {"NullRow": -1, "SelfDupRow": -1, "OtherDupRow": -1, "NullPercent": -1, "TotalRow": -1, "RestRow": -1,
                "TotalColumn": -1, "Score": -1}
        data2 = pd.DateFrame()
        return None
    finally:
        dbconn.close()

def getResult(request,id):
    # try:
        print(type(id))
        result = request.session[str(id)]
        del request.session[str(id)]
        return JsonResponse(result)
    # except:
    #
    #     return JsonResponse({})


def execute(dbconn, query, bufferd=True):
    try:
        # 커서를 취득한다.
        cursor = dbconn.cursor(buffered=bufferd);
        # 쿼리를 실행한다.
        cursor.execute(query);
        # 쿼리를 커밋한다.
        dbconn.commit();
    except Exception as e:
        # 에러가 발생하면 쿼리를 롤백한다.
        dbconn.rollback();
        raise e;

# import numpy as np
# dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
# merge_bulk(dbconn,"INSERT INTO Rest_Rev VALUE (%s, %s, %s, %s, %s)",[(1,"1",None,1,1)])
# # merge_bulk(dbconn,"INSERT INTO Rest_Rev VALUE (%s, %s, %s, %s, %s)",[(1,"1",2,1,1.)])
# dbconn.commit()

# execute(dbconn,"DELETE FROM Rest_Rev WHERE SubmissionID IN ('124','125')")

