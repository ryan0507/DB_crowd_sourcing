from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
import mysql.connector
import json
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
    print("result : ", result)
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
        val_dict = {"TaskID": data["TaskID"], "SubmissionPeriod": data["SubmissionPeriod"],
                    "TableName": data["TableName"], "TaskSchema": data["TaskSchema"],
                    "Name": data["Name"], "Description": data["Description"]}
        merge("INSERT INTO TASK VALUES (%s %s %s %s %s %s)", val_dict)
        value_lst.append(val_dict)
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
        print(info_dict)
        info_lst.append(info_dict)

    return JsonResponse(info_lst, safe=False)

def FileDetailView(request, infoID, fileID):

    file_lst = []

    sql = """SELECT OriginalTypeID, TaskID, OriginSchema
          FROM ORIGINAL_DATA_TYPE WHERE TaskID = %s AND OriginalTypeID = %s"""

    list_arg = []
    list_arg.append(infoID)
    list_arg.append(fileID)
    print("list_arg : ", list_arg)

    for file in selectDetail(sql, list_arg):
        info_dict = {"OriginalTypeID": file[0], "TaskID": file[1], "OriginSchema": file[2]}
        print(info_dict)
        file_lst.append(info_dict)

    return JsonResponse(file_lst, safe=False)

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
        print("No data")
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
        print("No data")
        return JsonResponse({})

def UserListView(request):

    result_lst = []
    sql = "SELECT * FROM USER"
    for row in select(sql):
        tmp_dict = {"MainID": row[0], "ID": row[1], "Password": row[2], "Name": row[3],
                    "Gender": row[4], "Address": row[5], "DateOfBirth": row[6], "PhoneNumber": row[7]}
        result_lst.append(tmp_dict)
    return JsonResponse(result_lst, safe=False)

def PresenterDetailView(request, su_ID):

    print("ID: ", su_ID)
    pre_lst = []

    sql = """SELECT SubmissionID, SubmissionDate, StartDate, FileName, P_NP 
                    FROM PARSING_DATA
                    WHERE SubmitterID = %s"""

    su_ID = "su " + str(su_ID)
    list_arg = []
    list_arg.append(su_ID)
    print("list_arg: ", list_arg)

    for row in selectDetail(sql, list_arg):
        pre_dict = {"SubmissionID": row[0], "SubmissionDate": row[1], "StartDate": row[2],
                    "FileName": row[3], "P_NP": row[4]}
        pre_lst.append(pre_dict)
    return JsonResponse(pre_lst, safe=False)

def EstimatorDetailView(request, as_ID):

    print("ID: ", as_ID)
    est_lst = []

    sql = """SELECT SubmissionID, FileName, P_NP
                        FROM PARSING_DATA
                        WHERE AssessorID = %s"""

    as_ID = "as " + str(as_ID)
    list_arg = []
    list_arg.append(as_ID)
    print("list_arg: ", list_arg)

    for row in selectDetail(sql, list_arg):
        print("in")
        est_dict = {"SubmissionID": row[0], "SubmissionDate": row[1], "P_NP": row[2]}
        est_lst.append(est_dict)
    return JsonResponse(est_lst, safe=False)
