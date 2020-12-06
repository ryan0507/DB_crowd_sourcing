from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import mysql.connector
import json
from datetime import date
import pandas as pd

DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = '1246team!'
DB_DATABASE = "DB_test"

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
    except Exception as e:
        dbconn.rollback();
        raise e;

def merge_bulk(dbconn, query, values, bufferd=True):
  try:
    cursor = dbconn.cursor(buffered=bufferd);
    cursor.executemany(query, values);
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
        dbconn.rollback()
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
        dbconn.rollback()
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
        dbconn.rollback()
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
        dbconn.rollback()
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
        dbconn.rollback()
        return JsonResponse(tmp_dict)
    finally:
        dbconn.close();

def RaterFileDetailMergeView(request):
    # try:
        data = json.loads(request.body)
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        ## 평가 반영 ##
        noQual, noPNP = False, False
        if ((data["QualAssessment"] == 0) | (data["QualAssessment"] == '')) : noQual = True
        if ((data["P_NP"] == "") | (data["P_NP"] == '')) : noPNP = True
        if (noQual & noPNP):
            return JsonResponse({"state": "nothing", "message": "평가를 위해서는 점수와 패스 여부를 입력해야 합니다."})
        elif noQual:
            return JsonResponse({"state" : "noQual", "message" : "평가를 위해서는 점수를 입력해야 합니다."})
        elif noPNP:
            return JsonResponse({"state" : "noPNP", "message" : "평가를 위해서는 패스 여부를 입력해야 합니다."})
        val_tuple = (data["QualAssessment"], data["P_NP"] , data["SubmissionID"])
        print(val_tuple)

        ## 테이블 수정 (P -> 튜플 옮기기, NP -> 튜플 삭제)
        sql = """SELECT T.TABLENAME, T.TaskSchema FROM TASK AS T, PARSING_DATA AS P, ORIGINAL_DATA_TYPE AS O 
                WHERE P.ORIGINALTYPEID = O.ORIGINALTYPEID AND O.TASKID = T.TASKID AND P.SUBMISSIONID = '{}'""".format(data["SubmissionID"])
        for row in select(dbconn, sql):
            tableName = row[0]
            waitTableName = row[0] + "_W"
            taskschema = row[1].split("%")[::2]

        # P인 경우
        if data["P_NP"] == "P":
            nullNumberChanged, originalNum, changedNum = False, 0, 0
            sql2 = "SELECT * FROM {} WHERE SUBMISSIONID = '{}'".format(waitTableName, data["SubmissionID"]) # 대기 테이블의 모든 튜플을 가져오는 sql
            #sql3 = "SELECT NUMBEROFTUPLE FROM PARSING_DATA WHERE SUBMISSIONID = '{}'".format(data["SubmissionID"]) # 해당 제출의 저장된 튜플 수 가져오는 sql
            sql3 = "SELECT * FROM {}".format(tableName) # 태스크의 데이터 테이블 가져오는 sql

            selected_df = pd.DataFrame(select(dbconn, sql2))
            original_df = pd.DataFrame(select(dbconn, sql3))
            selectedColumnNum = selected_df.shape[1]
            value_template = "%s" + (", %s" * (selectedColumnNum - 1))


            final_df = pd.concat([original_df, selected_df], axis = 0)
            originalNum, selectedNum = original_df.shape[0], selected_df.shape[0]

            final_df = final_df.drop_duplicates(final_df.columns[1:], keep = 'first')
            finalNum = final_df.shape[0]

            sql4 = "DELETE FROM {}".format(tableName)
            sql5 = "INSERT INTO {} VALUES ({})".format(tableName, value_template)

            merge(dbconn, sql4, ())
            merge_bulk(dbconn, sql5, [tuple(i) for i in final_df.where(pd.notnull(final_df), None).values])

            if (finalNum != originalNum + selectedNum): # 중복된 data tuple이 있는 경우
                print("Duplicated : {} rows".format(originalNum + selectedNum - finalNum))
                newTupleNum = originalNum + selectedNum - finalNum
                sql5 = "UPDATE PARSING_DATA SET NUMBEROFTUPLE = {} WHERE SUBMISSIONID = {}".format(newTupleNum, data["SubmissionID"]) # parsing_data의 numberOfTuple을 새로 업데이트하는 sql
                merge(dbconn, sql5, ())

        # P & NP인 경우 -> wait table의 data tuple 삭제해야한다
        val_tuple2 = ()
        sql6 = "DELETE FROM {} WHERE SubmissionID = {}".format(waitTableName, data["SubmissionID"])
        merge(dbconn, sql6, val_tuple2)

        # 위의 점수 및 패스여부 반영
        merge(dbconn, """UPDATE PARSING_DATA SET QualAssessment = %s, P_NP = %s
                                WHERE SubmissionID = %s""", val_tuple)

        dbconn.commit();
        return JsonResponse({"state" : "s", "message" : "평가가 반영되었습니다. 평가한 파일은 평가 내역에서 확인할 수 있습니다."})

    # except Exception as e:
    #     print(e)
    #     dbconn.rollback()
    #     return JsonResponse({}, safe=False)
    # finally:
    #     dbconn.close()
