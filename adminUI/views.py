from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
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

def AdminMainView(request):

    result_lst = []
    for row in select("SELECT TaskID, Name, Description FROM TASK"):
        tmp_dict = {"TaskID": row[0], "Name": row[1], "Description": row[2]}
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)

def TaskAddView(request):

    value_lst = []
    if len(request.body) != 0:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
#        print("data: ", data)
        value_lst.append(data["TaskID"])
        value_lst.append(data["Name"])
        value_lst.append(data["Description"])
#        value_lst.append(data["TaskThreshold"])
        value_lst.append(data["SubmissionPeriod"])
        value_lst.append(data["TableName"])
        value_lst.append(data["TaskSchema"])
#        print("values: ", value_lst)

#        val_dict = {"TaskID": data["TaskID"], "SubmissionPeriod": data["SubmissionPeriod"],
#                    "TableName": data["TableName"], "TaskSchema": data["TaskSchema"],
#                    "Name": data["Name"], "Description": data["Description"]}

        merge("INSERT INTO TASK VALUES (%s %s %s %s %s %s %s)", value_lst)
        return JsonResponse(value_lst, safe=False)
    else:
        print("No data")
        return JsonResponse({})

def TaskInfoView(request, infoID):

    info_lst = []

    sql = """SELECT T.TaskID, T.Name, T.Description
             FROM TASK T
             WHERE T.TaskID = %s"""

    list_arg = []
    list_arg.append(infoID)

    for info in selectDetail(sql, list_arg):
        info_dict = {"TaskID": info[0], "Name": info[1], "Description": info[2]}
        #print(info_dict)
        info_lst.append(info_dict)

    return JsonResponse(info_dict, safe=False)

def FileDetailView(request, infoID, fileID):

    file_lst = []

    sql = """SELECT OriginalTypeID, TaskID, OriginSchema
          FROM ORIGINAL_DATA_TYPE WHERE TaskID = %s AND OriginalTypeID = %s"""

    list_arg = []
    list_arg.append(infoID)
    list_arg.append(fileID)
    #print("list_arg : ", list_arg)

    for file in selectDetail(sql, list_arg):
        file_dict = {"OriginalTypeID": file[0], "TaskID": file[1], "OriginSchema": file[2]}
        #print(file_dict)
        file_lst.append(file_dict)

    return JsonResponse(file_dict, safe=False)

def DataTypeAddView(request, infoID):

    value_lst = []
    if len(request.body) != 0:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        val_dict = {"OriginSchema": data["OriginSchema"], "Mapping": data["Mapping"]}
        merge("INSERT INTO Origianl_Data VALUES (%s %s)", val_dict)
        val_dict["TaskID"] = infoID
        value_lst.append(val_dict)
        return JsonResponse(value_lst, safe=False)
    else:
        #print("No data")
        return JsonResponse({})

def TableSchemaAddView(request, infoID):

    value_lst = []
    if len(request.body) != 0:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        val_dict = {"TaskSchema": data["TaskSchema"]}
        merge("INSERT INTO TASK VALUES (%s)", val_dict)
        val_dict["TaskID"] = infoID
        value_lst.append(val_dict)
        return JsonResponse(value_lst, safe=False)
    else:
        #print("No data")
        return JsonResponse({})

def UserListView(request):

    result_lst = []
    today = date.today()
    sql = "SELECT * FROM USER"
    for row in select(sql):
        tmp_dict = {"MainID": row[0], "ID": row[1], "Password": row[2], "Name": row[3],
                    "Gender": row[4], "Address": row[5], "DateOfBirth": row[6], "PhoneNumber": row[7]}
        age = today - tmp_dict["DateOfBirth"]
        age = int(int(age.days) / 365)
        tmp_dict["age"] = age
        if tmp_dict["MainID"][:2] == "su":
            tmp_dict["role"] = "submitter"
            tmp_dict["MainID"] = tmp_dict["MainID"][3:]
            result_lst.append(tmp_dict)
        elif tmp_dict["MainID"][:2] == "as":
            tmp_dict["role"] = "assessor"
            tmp_dict["MainID"] = tmp_dict["MainID"][3:]
            result_lst.append(tmp_dict)

    return JsonResponse(result_lst, safe=False)

def PresenterDetailView(request, su_ID):

    pre_lst = []

    sql = """SELECT SubmissionID, SubmissionDate, FileName, QuanAssessment, P_NP 
                    FROM PARSING_DATA
                    WHERE SubmitterID = %s"""

    su_ID = "su " + str(su_ID)
    list_arg = []
    list_arg.append(su_ID)
    pre_lst.append({"ID": su_ID})

    files_num = 0
    pass_num = 0
    for row in selectDetail(sql, list_arg):
        files_num += 1
        pre_dict = {"SubmissionID": row[0], "SubmissionDate": row[1], "FileName": row[2],
                    "QuanAssessment" : row[3], "P_NP": row[4]}
        pre_lst.append(pre_dict)
        if pre_dict["P_NP"] == "P": pass_num += 1
    pre_lst.append({"Total": files_num})
    pre_lst.append({"Pass": pass_num})
    return JsonResponse(pre_lst, safe=False)

def EstimatorDetailView(request, as_ID):

    est_lst = []

    sql = """SELECT T.Name, P.SubmissionID, P.FileName, P.QualAssessment, P.P_NP
                        FROM PARSING_DATA P, TASK T, ORIGINAL_DATA_TYPE O
                        WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = T.TaskID AND P.AssessorID = %s"""

    as_ID = "as " + str(as_ID)
    list_arg = []
    list_arg.append(as_ID)
    est_lst.append({"ID": as_ID})

    files_num = 0
    pass_num = 0
    for row in selectDetail(sql, list_arg):
        files_num += 1
        est_dict = {"TaskName": row[0]}
        file_dict = {"SubmissionID": row[1], "SubmissionDate": row[2],
                    "QualAssessment": row[3], "P_NP": row[4]}
        est_dict["Files"] = file_dict
        est_lst.append(est_dict)
        if est_dict["Files"]["P_NP"] == "P": pass_num += 1
    est_lst.append({"Total": files_num})
    est_lst.append({"Pass": pass_num})
    return JsonResponse(est_lst, safe=False)
