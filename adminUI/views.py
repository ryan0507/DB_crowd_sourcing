from django.http import JsonResponse, HttpResponse
import mysql.connector
import json, sys
from datetime import date, datetime
import csv
from django.utils.encoding import smart_str

# dbconn = mysql.connector.connect(host="34.64.198.135", user="root", passwd="111111", database="DB_test")
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = "1246team!"
DB_DATABASE = "DB_test"

def execute(dbconn, query, bufferd=True):
    try:
        cursor = dbconn.cursor(buffered=bufferd);
        cursor.execute(query);
    except Exception as e:
        dbconn.rollback();
        raise e;

def select(dbconn, query, bufferd=True):
    cursor = dbconn.cursor(buffered=bufferd);
    cursor.execute(query);
    return cursor;


def selectDetail(dbconn, query, thisID, buffered=True):
    cursor = dbconn.cursor(buffered=buffered);
    cursor.execute(query, thisID)
    result = cursor.fetchall()
    return result;


def merge(dbconn, query, values, buffered=True):
    try:
        cursor = dbconn.cursor(buffered=buffered);
        cursor.execute(query, values);
    except Exception as e:
        dbconn.rollback();
        raise e;


def AdminMainView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, password=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        for row in select(dbconn, "SELECT T.TaskID, T.Name, T.Description FROM TASK T"):
            tmp_dict = {"TaskID": row[0], "Name": row[1], "Description": row[2], "Count": 0}

            # for row in select(dbconn, "SELECT T.TaskID, T.Name, T.Description, COUNT(*) FROM TASK AS T, PARTICIPATE_TASK AS P
            #                            WHERE P.Pass='W' AND T.TaskID = P.TaskID GROUP BY T.TaskID"):
            #    tmp_dict = {"TaskID": row[0], "Name": row[1], "Description": row[2], "Count": row[3]}

            for row2 in select(dbconn, "SELECT TaskID, COUNT(*) FROM PARTICIPATE_TASK WHERE Pass = 'W' GROUP BY TaskID"):
                if row[0] == row2[0]:
                    tmp_dict["Count"] = row2[1]

            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();


def TaskAddView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        if len(request.body) != 0:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)
            tSchema = data["TableSchema"]

            for i in range(len(tSchema)):
                if i == 0:
                    tableSchema = tSchema[i]["up"] + "%" + tSchema[i]["down"]
                else:
                    tableSchema = tableSchema + "%" + tSchema[i]["up"] + "%" + tSchema[i]["down"]

            val_tuple = (data["Name"], data["Description"], data["TaskThreshold"],
                         data["SubmissionPeriod"], data["TableName"], tableSchema)
            merge(dbconn, """INSERT INTO TASK(Name, Description, TaskThreshold, SubmissionPeriod, TableName, TaskSchema) 
                                        VALUES (%s, %s, %s, %s, %s, %s)""", val_tuple)

            tmp = tableSchema.split("%")
            tablename = data["TableName"] + "_W"

            sql1 = "CREATE TABLE " + data["TableName"] + "(SubmissionID INT"
            sql2 = "CREATE TABLE " + tablename + "(SubmissionID INT"
            # pk1 = ",PRIMARY KEY("
            # pk2 = ",PRIMARY KEY(SubmissionID,"
            for i in range(len(tmp) // 2):
                if tmp[2 * i + 1] == "string":
                    tmp[2 * i + 1] = "VARCHAR(50)"
                elif tmp[2 * i + 1] == "float":
                    tmp[2 * i + 1] = "FLOAT"
                elif tmp[2 * i + 1] == "integer":
                    tmp[2 * i + 1] = "INT"
                elif tmp[2 * i + 1] == "boolean":
                    tmp[2 * i + 1] = "INT"
                sql1 = sql1 + "," + tmp[2 * i] + " " + tmp[2 * i + 1]
                sql2 = sql2 + "," + tmp[2 * i] + " " + tmp[2 * i + 1]
                # pk1 = pk1 + tmp[2 * i] + ","
                # pk2 = pk2 + tmp[2 * i] + ","
            # sql1 += (pk1[:-1] + "),FOREIGN KEY (SubmissionID) REFERENCES PARSING_DATA(SubmissionID));")
            # sql2 += (pk2[:-1] + "),FOREIGN KEY (SubmissionID) REFERENCES PARSING_DATA(SubmissionID));")
            sql1 += ",FOREIGN KEY (SubmissionID) REFERENCES PARSING_DATA(SubmissionID) ON DELETE CASCADE ON UPDATE CASCADE);"
            sql2 += ",FOREIGN KEY (SubmissionID) REFERENCES PARSING_DATA(SubmissionID) ON DELETE CASCADE ON UPDATE CASCADE);"

            execute(dbconn, sql1)
            execute(dbconn, sql2)

            list_arg = [data["Name"]]
            for row in selectDetail(dbconn, "SELECT TaskID FROM TASK WHERE Name = %s", list_arg):
                taskID = str(row[0])

            for j in range(len(data["OriginData"])):
                oSchema = data["OriginData"][j]["schema"]
                for i in range(len(oSchema)):
                    if i == 0:
                        mapping = oSchema[i]["up"] + "%" + oSchema[i]["down"]
                    else:
                        mapping = mapping + "%" + oSchema[i]["up"] + "%" + oSchema[i]["down"]

                data_tuple = (taskID, data["OriginData"][j]["name"], mapping)
                merge(dbconn, """INSERT INTO ORIGINAL_DATA_TYPE(TaskID, OriginSchema, Mapping) 
                                    VALUES (%s, %s, %s)""", data_tuple)
                dbconn.commit()

            value_lst = ["solved"]
            return JsonResponse(value_lst, safe=False)
        else:
            return JsonResponse({}, safe=False)

    except Exception as e:
        dbconn.rollback();
        return JsonResponse({}, safe=False)
    finally:
        dbconn.close()


def TaskInfoView(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        info_lst = []

        sql1 = """SELECT TaskID, Name, SubmissionPeriod, Description, TaskThreshold, TaskSchema, TableName
                        FROM TASK WHERE TaskID = %s"""

        sql2 = """SELECT U.MainID, U.Name, P.Pass
                FROM PARTICIPATE_TASK P, USER U
                WHERE U.MainID = P.SubmitterID AND P.TaskID = %s"""

        # sql3 = """SELECT U.MainID, U.Name, O.OriginSchema, D.SubmissionDate,
        #             D.SubmissionNumber, D.FileName, D.NumberOfTuple, D.P_NP, D.SubmissionID
        #         FROM PARSING_DATA D, USER U, TASK T, ORIGINAL_DATA_TYPE O
        #         WHERE T.TaskID = %s AND T.TaskID = O.TaskID
        #             AND O.OriginalTypeID = D.OriginalTypeID AND D.SubmitterID = U.MainID"""

        sql3 = """SELECT U.MainID, U.Name, O.OriginSchema, D.SubmissionDate, D.SubmissionNumber, D.FileName, 
                        D.NumberOfTuple, D.P_NP, D.SubmissionID, D.QualAssessment, D.QuanAssessment
                    FROM PARSING_DATA D LEFT JOIN USER U ON D.SubmitterID = U.MainID, TASK T, ORIGINAL_DATA_TYPE O
                    WHERE T.TaskID = %s AND T.TaskID = O.TaskID AND O.OriginalTypeID = D.OriginalTypeID"""
        list_arg = [infoID]

        for info in selectDetail(dbconn, sql1, list_arg):
            ta_tmp = info[5].split("%")
            info_dict = {"TaskID": info[0], "Name": info[1], "SubmissionPeriod": info[2], "Description": info[3],
                         "Threshold": info[4], "Task_Schema": [{"Big": ta_tmp[2 * i], "small": ta_tmp[2 * i + 1]}
                                                               for i in range(len(ta_tmp) // 2)], "OriginalData": []}
            sql = "SELECT O.OriginSchema, O.Mapping FROM ORIGINAL_DATA_TYPE O WHERE O.TaskID = %s"
            for schema in selectDetail(dbconn, sql, list_arg):
                or_tmp = schema[1].split("%")
                schema_dict = {"Name": schema[0],
                               "Schema": [{"Big": or_tmp[2 * i], "small": or_tmp[2 * i + 1]}
                                          for i in range(len(or_tmp) // 2)]}
                info_dict["OriginalData"].append(schema_dict)

        info_dict["Participant"] = []
        info_dict["Request"] = []
        for info in selectDetail(dbconn, sql2, list_arg):
            score = 0
            file_num = 0
            sql = "SELECT QualAssessment, QuanAssessment FROM PARSING_DATA WHERE SubmitterID = %s"
            user_id = ["su " + str(info[0][3:])]
            for user in selectDetail(dbconn, sql, user_id):
                score += ((user[0] + user[1]) / 2)
                file_num += 1
            if file_num == 0:
                average = 0
            else:
                average = round(score / file_num, 2)

            if info[2] == "W":
                info_dict["Request"].append({"UserID": info[0][3:], "UserName": info[1],
                                             "Average": average, "Pass": info[2]})
            else:
                info_dict["Participant"].append({"UserID": info[0][3:], "UserName": info[1],
                                                 "Average": average, "Pass": info[2]})

        file_total = 0
        file_pass = 0
        tuple_pass = 0
        info_dict["Statistics"] = {"Files": []}
        for info in selectDetail(dbconn, sql3, list_arg):
            if info[0] == None:
                sub_dict = {"UserID": sys.maxsize, "UserName": "탈퇴한 회원", "OriginSchema": info[2], "SubmissionDate": info[3],
                            "SubmissionNumber": info[4], "FileName": info[5], "P_NP": info[7], "SubmissionID": info[8],
                            "QualAssessment": info[9], "QuanAssessment": info[10]}
            else:
                sub_dict = {"UserID": info[0][3:], "UserName": info[1], "OriginSchema": info[2],"SubmissionDate": info[3],
                            "SubmissionNumber": info[4], "FileName": info[5], "P_NP": info[7], "SubmissionID": info[8],
                            "QualAssessment": info[9], "QuanAssessment": info[10]}

            sub_dict["SubmissionTime"] = sub_dict["SubmissionDate"].strftime('%H:%M:%S')
            sub_dict["SubmissionDate"] = sub_dict["SubmissionDate"].strftime('%Y-%m-%d')
            sub_dict["QualAssessment"] = int(sub_dict["QualAssessment"])
            sub_dict["QuanAssessment"] = round(sub_dict["QuanAssessment"], 2)
            info_dict["Statistics"]["Files"].append(sub_dict)
            file_total += 1
            if sub_dict["P_NP"] == "P":
                file_pass += 1
                tuple_pass += info[6]
        info_dict["Statistics"]["Total"] = file_total
        info_dict["Statistics"]["Pass"] = file_pass
        info_dict["Statistics"]["Tuple"] = tuple_pass
        info_lst.append(info_dict)

        return JsonResponse(info_dict, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def TypeAddView(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        arg_tuple = (infoID,)
        merge(dbconn, "DELETE FROM ORIGINAL_DATA_TYPE WHERE TaskID = %s", arg_tuple)

        for i in range(len(data["OriginalData"])):
            oSchema = data["OriginalData"][i]["Schema"]
            for j in range(len(oSchema)):
                if j == 0:
                    mapping = oSchema[j]["Big"] + "%" + oSchema[j]["small"]
                else:
                   mapping = mapping + "%" + oSchema[j]["Big"] + "%" + oSchema[j]["small"]

            data_tuple = (infoID, data["OriginalData"][i]["Name"], mapping)
            merge(dbconn, """INSERT INTO ORIGINAL_DATA_TYPE(TaskID, OriginSchema, Mapping) 
                                VALUES (%s, %s, %s)""", data_tuple)
            dbconn.commit()

        return JsonResponse([], safe=False)

    except Exception as e:
        dbconn.rollback()
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def UserUpdateView(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        for i in range(len(data["Participant"])):
            if data["Participant"][i]["Pass"] == "P":
                userID = "su " + data["Participant"][i]["UserID"]
                tuple_arg = (userID, str(infoID))
                sql = "UPDATE PARTICIPATE_TASK SET PASS = 'P' WHERE SubmitterID = %s AND TaskID = %s"
                merge(dbconn, sql, tuple_arg)

        for i in range(len(data["Request"])):
            if data["Request"][i]["Pass"] == "N":
                userID = "su " + data["Request"][i]["UserID"]
                tuple_arg = (userID, str(infoID))
                sql = "DELETE FROM PARTICIPATE_TASK WHERE SubmitterID = %s AND TaskID = %s"
                merge(dbconn, sql, tuple_arg)

        dbconn.commit()
        return JsonResponse([], safe=False)

    except Exception as e:
        dbconn.rollback()
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def FileDetailView(request, infoID, fileID):

    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        list_arg1 = [infoID]
        sql1 = "SELECT TableName FROM TASK WHERE TaskID = %s"
        for file in selectDetail(dbconn, sql1, list_arg1):
            tableName = file[0]

        sql2 = "SELECT * FROM " + tableName + " WHERE SubmissionID = %s"
        sql3 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS" + " WHERE TABLE_NAME = %s"

        list_arg2 = [fileID]
        sql4 = "SELECT FileName FROM PARSING_DATA WHERE SubmissionID = %s"
        for name in selectDetail(dbconn, sql4, list_arg2):
            fileName = name[0]

        list_arg3 = [tableName]
        column_lst = selectDetail(dbconn, sql3, list_arg3)

        data_dict = {"FileName": fileName, "Columns": [], "Submissions": []}
        for j in range(len(column_lst)):
            data_dict["Columns"].append(''.join(column_lst[j]))
        for data in selectDetail(dbconn, sql2, list_arg2):
            sub_dict = {"submission": []}
            for i in range(len(column_lst)):
                sub_dict["submission"].append(str(data[i]))
            data_dict["Submissions"].append(sub_dict)

        return JsonResponse(data_dict, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def UserListView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        result_lst = []
        today = date.today()
        sql = """SELECT U.MainID, U.ID, U.Name, U.Gender, U.Address, U.DateOfBirth, U.PhoneNumber, T.Name
                    FROM USER U
                    LEFT OUTER JOIN PARTICIPATE_TASK P ON U.MainID = P.SubmitterID
                    LEFT OUTER JOIN TASK T ON T.TaskID = P.TaskID"""
        for row in select(dbconn, sql):
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
                        del (tmp_dict["TaskName"])
                        in_list = True
                        break
                if not in_list:
                    tmp_dict["Task"] = []
                    tmp_dict["Task"].append(tmp_dict["TaskName"])
                    del (tmp_dict["TaskName"])
                    result_lst.append(tmp_dict)
            else:
                tmp_dict["role"] = "assessor"
                tmp_dict["MainID"] = tmp_dict["MainID"][3:]
                del (tmp_dict["TaskName"])
                result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def PresenterDetailView(request, su_ID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        sql = "SELECT MainID, ID FROM USER WHERE MainID = %s"
        su_ID = "su " + str(su_ID)
        list_arg = [su_ID]

        count = 0
        score = 0
        pre_dict = {"Tasks": [], "ID": "", "score": 0}

        for row in selectDetail(dbconn, sql, list_arg):
            pre_dict["ID"] = row[1]

        sql3 = """SELECT T.Name, T.TaskID FROM TASK T, PARTICIPATE_TASK P 
                    WHERE P.TaskID = T.TaskID AND P.Pass = 'P' AND P.SubmitterID = %s"""

        for row3 in selectDetail(dbconn, sql3, list_arg):
            taskName = row3[0]
            taskID = row3[1]
            score = 0
            task_dict = {"TaskID": taskID, "TaskName": taskName, "Files": [], "Total": 0, "Pass": 0}
            pre_dict["Tasks"].append(task_dict)

            sql2 = """SELECT P.SubmissionNumber, P.SubmissionDate, O.OriginSchema,
                            P.FileName, P.QualAssessment, P.QuanAssessment, P.P_NP, P.SubmissionID
                        FROM PARSING_DATA P, ORIGINAL_DATA_TYPE O
                        WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = %s AND P.SubmitterID = %s"""

            list_arg2 = (taskID, su_ID)
            for row2 in selectDetail(dbconn, sql2, list_arg2):
                score += ((row2[4] + row2[5]) / 2)
                file_dict = {"SubmissionID": row2[7], "SubmissionNum": row2[0], "SubmissionDate": row2[1],
                             "OriginSchema": row2[2], "FileName": row2[3], "QualAssessment": row2[4],
                             "QuanAssessment": row2[5], "P_NP": row2[6]}
                file_dict["SubmissionTime"] = file_dict["SubmissionDate"].strftime('%H:%M:%S')
                file_dict["SubmissionDate"] = file_dict["SubmissionDate"].strftime('%Y-%m-%d')
                file_dict["QualAssessment"] = int(file_dict["QualAssessment"])
                file_dict["QuanAssessment"] = round(file_dict["QuanAssessment"], 2)
                if file_dict["P_NP"] == "P": task_dict["Pass"] += 1

                for j in range(len(pre_dict["Tasks"])):
                    if pre_dict["Tasks"][j]["TaskName"] == taskName:
                        pre_dict["Tasks"][j]["Files"].append(file_dict)
                task_dict["Total"] += 1

        count += 1
        if count != 0:
            pre_dict["score"] = round(score / count, 2)

        return JsonResponse(pre_dict, safe=False)

    except Exception as e:
        print(e)
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def EstimatorDetailView(request, as_ID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        sql = "SELECT MainID, ID FROM USER WHERE MainID = %s"
        as_ID = "as " + str(as_ID)
        list_arg = [as_ID]

        est_dict = {"ID": "", "Files": [], "Total": 0, "Check": 0, "Pass": 0}
        for row in selectDetail(dbconn, sql, list_arg):
            est_dict["ID"] = row[1]

        sql2 = """SELECT T.TaskID, T.Name, O.OriginSchema, P.FileName, P.QualAssessment, P.P_NP, P.SubmissionID
                    FROM PARSING_DATA P, TASK T, ORIGINAL_DATA_TYPE O
                    WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = T.TaskID
                    AND P.AssessorID = %s"""

        total_num = 0
        check_num = 0
        pass_num = 0
        for row in selectDetail(dbconn, sql2, list_arg):
            as_ID = row[0]
            file_dict = {"TaskID": row[0], "TaskName": row[1], "SubmitterName": "탈퇴", "OriginSchema": row[2],
                         "Filename": row[3], "QualAssessment": row[4], "P_NP": row[5], "SubmissionID": row[6]}
            file_dict["QualAssessment"] = int(file_dict["QualAssessment"])
            list_arg2 = [row[6]]
            sql3 = "SELECT S.Name FROM USER S, PARSING_DATA P WHERE P.SubmitterID = S.MainID AND P.SubmissionID = %s"
            for row2 in selectDetail(dbconn, sql3, list_arg2):
                file_dict["SubmitterName"] = row2[0]
            est_dict["Files"].append(file_dict)
            total_num += 1
            if row[5] != 'W': check_num += 1
            if row[5] == 'P': pass_num += 1
        est_dict["Total"] = total_num
        est_dict["Check"] = check_num
        est_dict["Pass"] = pass_num
        return JsonResponse(est_dict, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def alterPassword(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        val_tuple = (data["Password"], data["MainID"])
        merge(dbconn, """UPDATE USER SET Password = %s WHERE MainID = %s""", val_tuple)
        dbconn.commit()
        return JsonResponse({"state": "s", "message": "개인정보가 성공적으로 수정 되었습니다."})
    except Exception as e:
        dbconn.rollback();
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def download_csv_data(request, TaskID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        TableName, TaskSchema = next(
            select(dbconn, "SELECT TableName, TaskSchema FROM TASK WHERE TaskID = {}".format(TaskID)))

        # response content type
        response = HttpResponse(status=200, content_type='text/csv')
        # decide the file name
        response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(TableName)
        writer = csv.writer(response, csv.excel)
        writer.writerow([smart_str(i) for i in TaskSchema.split("%")[::2]])
        data = select(dbconn, "SELECT * FROM {}".format(TableName))
        [writer.writerow(row[1:]) for row in data]
        return response
    except Exception as e:
        return HttpResponse("오류가 발생했습니다.", status=202)
    finally:
        dbconn.close();
