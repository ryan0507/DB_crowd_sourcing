from django.http import JsonResponse
import mysql.connector
import json
from datetime import date, datetime

dbconn = mysql.connector.connect(host="34.64.198.135", user="root", passwd="111111", database="DB_test")
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = "111111"
DB_DATABASE = "DB_test"


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
        for row in select(dbconn, "SELECT T.TaskID, T.Name, T.Description, COUNT(*) FROM TASK AS T, PARTICIPATE_TASK AS P WHERE P.Pass='W' AND T.TaskID = P.TaskID GROUP BY T.TaskID"):
            tmp_dict = {"TaskID": row[0], "Name": row[1], "Description": row[2], "Count": row[3]}
            result_lst.append(tmp_dict)
        return JsonResponse(result_lst, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close();


def TableSchemaAddView(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        value_lst = []
        if len(request.body) != 0:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)
            val_tuple = (str(infoID), data["TaskSchema"])
            merge(dbconn, "UPDATE TASK SET TaskSchema = %s WHERE TaskID = %s", val_tuple)
            value_lst.append(val_tuple)
            dbconn.commit();
            return JsonResponse(value_lst, safe=False)
        else:
            return JsonResponse([], safe=False)

    except Exception as e:
        dbconn.rollback();
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()



def TaskAddView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        value_lst = []
        if len(request.body) != 0:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)
            val_tuple = (data["Name"], data["Description"], data["TaskThreshold"],
                         data["SubmissionPeriod"], data["TableName"], data["TableSchema"])
            value_lst.append(val_tuple)

            tmp = data["TaskSchema"].split("%")
            sql = "CREATE TABLE %s(TableID	INT	AUTO_INCREMENT PRIMARY KEY"
            for i in range(len(tmp) // 2):
                if tmp[2 * i + 1] == "string":
                    tmp[2 * i + 1] = "VARCHAR(40)"
                elif tmp[2 * i + 1] == "float":
                    tmp[2 * i + 1] = "FLOAT(6,4)"
                elif tmp[2 * i + 1] == "integer":
                    tmp[2 * i + 1] = "INT"
                elif tmp[2 * i + 1] == "boolean":
                    tmp[2 * i + 1] = "BOOLEAN"
                sql = sql + "," + " %s %s"
            sql += ");"
            tmp_tuple = (data["TableName"]) + tuple(tmp)

            merge(dbconn, """INSERT INTO TASK(Name, Description, TaskThreshold, SubmissionPeriod, TableName, TaskSchema) 
                VALUES (%s, %s, %s, %s, %s, %s)""", val_tuple)

            merge(dbconn, sql, tmp_tuple)
            dbconn.commit();
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

        sql1 = """SELECT TaskID, Name, SubmissionPeriod, Description, TaskThreshold, TaskSchema
                        FROM TASK WHERE TaskID = %s"""

        sql2 = """SELECT U.MainID, U.Name, P.Pass
                FROM PARTICIPATE_TASK P, USER U
                WHERE U.MainID = P.SubmitterID AND P.TaskID = %s"""

        sql3 = """SELECT U.MainID, U.Name, O.OriginSchema, D.SubmissionDate, 
                    D.SubmissionNumber, D.FileName, D.NumberOfTuple, D.P_NP 
                FROM TASK T, ORIGINAL_DATA_TYPE O, PARSING_DATA D, USER U
                WHERE T.TaskID = %s AND T.TaskID = O.TaskID 
                    AND O.OriginalTypeID = D.OriginalTypeID AND D.SubmitterID = U.MainID"""

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
                               "Schema": [{"Big": or_tmp[2 * i],"small": or_tmp[2 * i + 1]}
                                                    for i in range(len(or_tmp) // 2)]}
                info_dict["OriginalData"].append(schema_dict)

        info_dict["Participant"] = []
        info_dict["Request"] = []
        for info in selectDetail(dbconn, sql2, list_arg):
            score = 0
            file_num = 0
            sql = "SELECT QualAssessment FROM PARSING_DATA WHERE SubmitterID = %s"
            user_id = ["su " + str(info[0][3:])]
            for user in selectDetail(dbconn, sql, user_id):
                score += user[0]
                file_num += 1
            if file_num == 0: average = 0
            else: average = score / file_num

            if info[2] == "W":
                info_dict["Request"].append({"UserID": info[0][3:], "UserName": info[1], "Average": average})
            else:
                info_dict["Participant"].append({"UserID": info[0][3:], "UserName": info[1], "Average": average})

        file_total = 0
        file_pass = 0
        tuple_pass = 0
        info_dict["Statistics"] = {"Files": []}
        for info in selectDetail(dbconn, sql3, list_arg):
            sub_dict = {"UserID": info[0][3:], "UserName": info[1], "OriginSchema": info[2], "SubmissionDate": info[3],
                        "SubmissionNumber": info[4], "FileName": info[5], "P_NP": info[7]}
            sub_dict["SubmissionTime"] = sub_dict["SubmissionDate"].strftime('%H:%M:%S')
            sub_dict["SubmissionDate"] = sub_dict["SubmissionDate"].strftime('%Y-%m-%d')
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


def FileDetailView(request, infoID, fileID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        file_lst = []

        sql = """SELECT O.OriginalTypeID, O.TaskID, O.OriginSchema, O.Mapping, P.FileName
                FROM ORIGINAL_DATA_TYPE O, PARSING_DATA P 
                WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = %s AND O.OriginalTypeID = %s"""

        list_arg = [infoID, fileID]

        for file in selectDetail(dbconn, sql, list_arg):
            tmp = file[5].split("%")
            file_dict = {"OriginalTypeID": file[0], "TaskID": file[1], "OriginSchema": file[2],
                         "Schema": [{"Big": tmp[2 * i],"small": tmp[2 * i + 1]} for i in range(len(tmp) // 2)],
                         "Files": file[4]}
            file_lst.append(file_dict)

        return JsonResponse(file_dict, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def DataTypeAddView(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        value_lst = []
        if len(request.body) != 0:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)
            SchemaName = data[len(data) - 1]["Name"]
            mapping = ""
            for data in len(data[len(data) - 1]["Schema"]):
                if data != 0:
                    mapping = mapping + "%" + data["Up"]
                else: mapping += data["Up"]
                mapping = mapping + "%" + data["Down"]
            val_tuple = (infoID, SchemaName, mapping)
            merge(dbconn, "INSERT INTO Origianl_Data_Type(TaskID, OriginSchema, Mapping) VALUES (%d %s %s)", val_tuple)
            value_lst.append(val_tuple)
            dbconn.commit();
            return JsonResponse(value_lst, safe=False)
        else:
            return JsonResponse([], safe=False)

    except Exception as e:
        dbconn.rollback();
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def TableSchemaAddView(request, infoID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        value_lst = []
        if len(request.body) != 0:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)
            val_tuple = (str(infoID), data["TaskSchema"])
            merge(dbconn, "UPDATE TASK SET TaskSchema = %s WHERE TaskID = %s", val_tuple)
            value_lst.append(val_tuple)
            dbconn.commit();
            return JsonResponse(value_lst, safe=False)
        else:
            return JsonResponse([], safe=False)

    except Exception as e:
        dbconn.rollback();
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
        sql = """SELECT A.ID, T.Name, P.SubmissionDate, P.FileName, P.QualAssessment, P.P_NP 
                        FROM PARSING_DATA P, TASK T, ORIGINAL_DATA_TYPE O, USER A
                        WHERE O.OriginalTypeID = P.OriginalTypeID AND T.TaskID = O.TaskID 
                        AND A.MainID = P.SubmitterID AND P.SubmitterID = %s"""

        su_ID = "su " + str(su_ID)
        list_arg = [su_ID]

        count = 0
        score = 0
        pre_dict = {"Tasks": []}
        tasks_dict = {}
        for row in selectDetail(dbconn, sql, list_arg):
            pre_dict["ID"] = row[0]
            taskName = row[1]
            score += row[4]
            file_dict = {"SubmissionDate": row[2], "FileName": row[3], "QualAssessment": row[4], "P_NP": row[5]}
            file_dict["SubmissionTime"] = file_dict["SubmissionDate"].strftime('%H:%M:%S')
            file_dict["SubmissionDate"] = file_dict["SubmissionDate"].strftime('%Y-%m-%d')
            file_dict["QualAssessment"] = int(file_dict["QualAssessment"])
            if taskName not in tasks_dict.keys():
                tasks_dict = {taskName: count}
                task_dict = {"TaskName": taskName}
                task_dict["Files"] = [file_dict]
                task_dict["Total"] = 1
                task_dict["Pass"] = 0
                pre_dict["Tasks"].append(task_dict)
            else:
                pre_dict["Tasks"][tasks_dict[taskName]]["Total"] += 1
                pre_dict["Tasks"][tasks_dict[taskName]]["Files"].append(file_dict)
            if file_dict["P_NP"] == "P": pre_dict["Tasks"][tasks_dict[taskName]]["Pass"] += 1
            count += 1
        pre_dict["score"] = score / count
        return JsonResponse(pre_dict, safe=False)

    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()


def EstimatorDetailView(request, as_ID):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        sql = """SELECT A.ID, T.Name, S.Name, P.FileName, P.QualAssessment, P.P_NP
                            FROM PARSING_DATA P, TASK T, ORIGINAL_DATA_TYPE O, USER A, USER S
                            WHERE O.OriginalTypeID = P.OriginalTypeID AND O.TaskID = T.TaskID 
                            AND P.AssessorID = A.MainID AND P.SubmitterID = S.MainID AND P.AssessorID = %s"""

        as_ID = "as " + str(as_ID)
        list_arg = [as_ID]

        total_num = 0
        check_num = 0
        pass_num = 0
        est_lst = []
        for row in selectDetail(dbconn, sql, list_arg):
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

    except Exception as e:
        return JsonResponse([], safe=False)


def alterPassword(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)

        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        val_tuple = (data["Password"],  data["MainID"])
        merge(dbconn, """UPDATE USER SET Password = %s WHERE MainID = %s""", val_tuple)
        dbconn.commit()
        return JsonResponse({"state": "s", "message": "개인정보가 성공적으로 수정 되었습니다."})
    except Exception as e:
        dbconn.rollback();
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()
