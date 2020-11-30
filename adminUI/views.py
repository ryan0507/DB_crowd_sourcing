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
        val_tuple = (data["Name"], data["Description"], data["TaskThreshold"],
                     data["SubmissionPeriod"], data["TableName"], data["TaskSchema"])
        value_lst.append(val_tuple)

        merge("""INSERT INTO TASK(Name, Description, TaskThreshold, SubmissionPeriod, TableName, TaskSchema) 
              VALUES (%s, %s, %s, %s, %s, %s)""", val_tuple)
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
    sql = """SELECT U.MainID, U.ID, U.Name, U.Gender, U.Address, U.DateOfBirth, U.PhoneNumber, T.Name
          FROM USER U
          LEFT OUTER JOIN PARTICIPATE_TASK P ON U.MainID = P.SubmitterID
          LEFT OUTER JOIN TASK T ON T.TaskID = P.TaskID"""
    for row in select(sql):
        tmp_dict = {"MainID": row[0], "ID": row[1], "Name": row[2], "Gender": row[3],
                    "Address": row[4], "DateOfBirth": row[5], "PhoneNumber": row[6], "TaskName": row[7]}
        age = today - tmp_dict["DateOfBirth"]
        age = int(int(age.days) / 365)
        tmp_dict["age"] = age - (age % 10)
        if tmp_dict["MainID"][:2] == "ad":
            continue
        elif tmp_dict["MainID"][:2] == "su":
            tmp_dict["role"] = "submitter"
            tmp_dict["MainID"] = tmp_dict["MainID"][3:]
            in_list = False
            for i in range(len(result_lst)):
                if tmp_dict["ID"] == result_lst[i]["ID"]:
                    result_lst[i]["Task"].append(tmp_dict["TaskName"])
                    del(tmp_dict["TaskName"])
                    in_list = True
                    break
            if in_list == False:
                    tmp_dict["Task"] = []
                    tmp_dict["Task"].append(tmp_dict["TaskName"])
                    del(tmp_dict["TaskName"])
                    result_lst.append(tmp_dict)
        else:
            tmp_dict["role"] = "assessor"
            tmp_dict["MainID"] = tmp_dict["MainID"][3:]
            del(tmp_dict["TaskName"])
            result_lst.append(tmp_dict)

    return JsonResponse(result_lst, safe=False)

def PresenterDetailView(request, su_ID):

    task_lst = []
    file_lst = []

    sql = """SELECT A.ID, T.Name, P.SubmissionID, P.SubmissionDate, P.FileName, P.QuanAssessment, P.P_NP 
                    FROM PARSING_DATA P, Task T, Original_Data_Type O, USER A
                    WHERE O.OriginalTypeID = P.OriginalTypeID AND T.TaskID = O.TaskID 
                    AND A.MainID = P.SubmitterID AND P.SubmitterID = %s"""

    su_ID = "su " + str(su_ID)
    list_arg = []
    list_arg.append(su_ID)

    for row in selectDetail(sql, list_arg):
        pre_dict = {"ID" : row[0]}
        pre_dict = {"SubmissionID": row[0], "SubmissionDate": row[1], "FileName": row[2],
                    "QuanAssessment" : row[3], "P_NP": row[4]}
        file_lst.append(pre_dict)
    return JsonResponse(pre_dict, safe=False)

def EstimatorDetailView(request, as_ID):

    sql = """SELECT A.ID, T.Name, S.Name, P.FileName, P.QualAssessment, P.P_NP
                        FROM PARSING_DATA P, TASK T, ORIGINAL_DATA_TYPE O, USER A, USER S
                        WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = T.TaskID 
                        AND P.AssessorID = A.MainID AND P.SubmitterID = S.MainID AND P.AssessorID = %s"""

    as_ID = "as " + str(as_ID)
    list_arg = []
    list_arg.append(as_ID)

    total_num = 0
    check_num = 0
    pass_num = 0
    est_lst = []
    for row in selectDetail(sql, list_arg):
        est_dict = {"ID": row[0]}
        file_dict = {"TaskName": row[1], "SubmitterName": row[2], "Filename": row[3],
                     "QualAssessment": row[4], "P_NP": row[5]}
        file_dict["QualAssessment"] = int(file_dict["QualAssessment"])
        est_lst.append(file_dict)
        total_num += 1
        if row[5] != 'W': check_num += 1
        if row[5] == 'P': pass_num += 1
    est_dict["Files"] = est_lst
    est_dict["Total"] = total_num
    est_dict["Check"] = check_num
    est_dict["Pass"] = pass_num

    return JsonResponse(est_dict, safe=False)
