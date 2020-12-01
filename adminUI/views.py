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

    sql = """SELECT T.TaskID, T.Name, T.TaskThreshold, O.Mapping, R.Name, 
                P.P_NP, D.QualAssessment, O.OriginSchema, S.Name, D.FileName, D.P_NP
             FROM TASK T, ORIGINAL_DATA_TYPE O, PARSING_DATA D, PARTICIPATE_TASK P, USER R, USER S
             WHERE T.TaskID = %s AND T.TaskID = O.TaskID AND T.TaskID = P.TaskID AND O.OriginalTypeID = D.OriginalTypeID
                AND R.MainID = P.SubmitterID AND S.MainID = D.SubmitterID"""

    list_arg = []
    list_arg.append(infoID)

    for info in selectDetail(sql, list_arg):
        info_dict = {"TaskID": info[0], "Name": info[1], "Threshold": info[2], "Mapping": info[3],
                     "RequestName": info[4], "Request": info[5], "QualAssessment": info[6], "OriginSchema": info[7],
                     "SubmitterName": info[8], "FileName": info[9], "P_NP": info[10]}
        info_lst.append(info_dict)

    return JsonResponse(info_dict, safe=False)

def FileDetailView(request, infoID, fileID):

    file_lst = []

    sql = """SELECT O.OriginalTypeID, O.TaskID, O.OriginSchema, O.Mapping, P.FileName
          FROM ORIGINAL_DATA_TYPE O, PARSING_DATA P 
          WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = %s AND O.OriginalTypeID = %s"""

    list_arg = []
    list_arg.append(infoID)
    list_arg.append(fileID)

    for file in selectDetail(sql, list_arg):
        file_dict = {"OriginalTypeID": file[0], "TaskID": file[1], "OriginSchema": file[2],
                     "Mapping": file[3], "Files": file[4]}
        file_lst.append(file_dict)

    return JsonResponse(file_dict, safe=False)

def DataTypeAddView(request, infoID):

    value_lst = []
    if len(request.body) != 0:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        val_tuple = (data["OriginSchema"],data["Mapping"])
        merge("INSERT INTO Origianl_Data(OriginSchema, Mapping) VALUES (%s %s)", val_tuple)
        value_lst.append(val_tuple)
        return JsonResponse(value_lst, safe=False)
    else:
        return JsonResponse({})

def TableSchemaAddView(request, infoID):

    value_lst = []
    if len(request.body) != 0:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        val_dict = (data["TaskSchema"])
        merge("INSERT INTO TASK(TaskSchema) VALUES (%s)", val_dict)
        value_lst.append(val_dict)
        return JsonResponse(value_lst, safe=False)
    else:
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

    sql = """SELECT A.ID, T.Name, P.SubmissionDate, P.FileName, P.P_NP 
                    FROM PARSING_DATA P, TASK T, ORIGINAL_DATA_TYPE O, USER A
                    WHERE O.OriginalTypeID = P.OriginalTypeID AND T.TaskID = O.TaskID 
                    AND A.MainID = P.SubmitterID AND P.SubmitterID = %s"""

    su_ID = "su " + str(su_ID)
    list_arg = []
    list_arg.append(su_ID)

    pre_dict = {}
    for row in selectDetail(sql, list_arg):
        pre_dict["ID"] = row[0]
        file_dict = {"TaskName": row[1], "SubmissionDate": row[2], "FileName": row[3], "P_NP": row[4]}
        taskName = file_dict["TaskName"]
        del(file_dict["TaskName"])
        if taskName not in pre_dict.keys():
            pre_dict[taskName] = {}
            pre_dict[taskName]["Files"] = []
            pre_dict[taskName]["Total"] = 1
            pre_dict[taskName]["Pass"] = 0
        else:
            pre_dict[taskName]["Total"] += 1
        if file_dict["P_NP"] == "P": pre_dict[taskName]["Pass"] += 1
        pre_dict[taskName]["Files"].append(file_dict)

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
        as_ID = row[0]
        file_dict = {"TaskName": row[1], "SubmitterName": row[2], "Filename": row[3],
                     "QualAssessment": row[4], "P_NP": row[5]}
        file_dict["QualAssessment"] = int(file_dict["QualAssessment"])
        est_lst.append(file_dict)
        total_num += 1
        if row[5] != 'W': check_num += 1
        if row[5] == 'P': pass_num += 1
    est_dict = {"ID": as_ID}
    est_dict["Files"] = est_lst
    est_dict["Total"] = total_num
    est_dict["Check"] = check_num
    est_dict["Pass"] = pass_num

    return JsonResponse(est_dict, safe=False)
