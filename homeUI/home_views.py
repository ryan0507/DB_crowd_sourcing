import json
from django.http import JsonResponse
import mysql.connector
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = '1246team!'
DB_DATABASE = "DB_test"

#dbconn = mysql.connector.connect(host="34.64.198.135", user="root", passwd="111111", database="DB_test")


def select(dbconn, query, bufferd=True):
  cursor = dbconn.cursor(buffered=bufferd)
  cursor.execute(query)
  return cursor


def merge(dbconn, query, values, buffered=True):
    try:
        cursor = dbconn.cursor(buffered=buffered)
        cursor.execute(query, values)
    except Exception as e:
        dbconn.rollback()
        raise e


def Login(request):
    try:
        data = json.loads(request.body)
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        for i in select(dbconn, "SELECT MainID, ID, Name FROM USER WHERE ID = '{}' and Password = '{}'".format(data["ID"], data[
            "Password"])):
            request.session['MainID'] = i[0]
            request.session['ID'] = i[1]
            request.session['Name'] = i[2]
            return JsonResponse({"MainID": i[0], "ID": i[1], "Name": i[2]})
        request.session['MainID'] = "-1"
        request.session['ID'] = "-1"
        request.session['Name'] = "-1"
        return JsonResponse({"MainID": "-1", "ID": "-1", "Name": "-1"})  # post에서 response에 status넣으면 안돼요!!
    except Exception as e:
        return JsonResponse({"MainID": "-1", "ID": "-1", "Name": "-1"})
    finally:
        dbconn.close()


def GetUser(request):
    try:
        return JsonResponse({"MainID": request.session['MainID'], "ID": request.session['ID'], "Name": request.session['Name']})
    except Exception as e:
        return JsonResponse({"MainID": "-1", "ID": "-1", "Name": "-1"})

def UserAddView(request):
    try:
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        value_lst = []
        if len(request.body) != 0:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)
            val_tuple = (data["MainID"], data["ID"], data["Password"], data["Name"], data["Gender"], data["Address"], data["DateOfBirth"], data["PhoneNumber"])
            value_lst.append(val_tuple)

            merge(dbconn, """INSERT INTO USER(MainID, ID, Password, Name, Gender, Address, DateOfBirth, PhoneNumber)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""", val_tuple)
            dbconn.commit()
            return JsonResponse(value_lst, safe=False)
        else:
            print("noData")
            return JsonResponse({})
    except Exception as e:
        dbconn.rollback()
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()

def GetId(request):
    try:
        id_list = []
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        for row in select(dbconn, "SELECT ID FROM USER"):
            tmp_dict = {"Id" : row[0]}
            id_list.append(tmp_dict)
        return JsonResponse(id_list, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()

def GetMainId(request):
    try:
        id_list = []
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        for row in select(dbconn, "SELECT MainID FROM USER"):
            tmp_dict = {"MainId" : row[0]}
            id_list.append(tmp_dict)
        return JsonResponse(id_list, safe=False)
    except Exception as e:
        return JsonResponse([], safe=False)
    finally:
        dbconn.close()

def logout(request):
    try:
        del request.session['MainID'], request.session['ID'], request.session['Name']
        return JsonResponse({"state" : "You're logged out."})
    except:
        return JsonResponse({"state": "Error"})

def withdrawal(request):
    try:
        data = json.loads(request.body)
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        if data["pw"] != list(select(dbconn,"SELECT Password FROM USER WHERE MainID = '{}'".format(request.session["MainID"])))[0][0]:
            return JsonResponse({"state": "f1", "message": "탈퇴를 위해서는 현재 비밀 번호를 입력해야합니다. 입력한 현재 비밀번호가 일치하지 않습니다."})
        merge(dbconn, "DELETE FROM USER WHERE MainID = %s", (request.session["MainID"],))
        # merge(dbconn, "UPDATE PARSING_DATA SET SubmitterID = %s WHERE SubmitterID IS NULL ",['ad 1'])
        del request.session['MainID'], request.session['ID'], request.session['Name']
        dbconn.commit()
        return JsonResponse({"state": "s", "message" : "성공적으로 탈퇴 되었습니다."})
    except Exception as e:
        dbconn.rollback()
        if "MainID" in request.session:
            del request.session['MainID']
        if "ID" in request.session:
            del request.session['ID']
        if "Name" in request.session:
            del request.session['Name']
        return JsonResponse({"state": "f2", "message": "오류가 발생했습니다. 로그아웃 되고 로그인 페이지로 돌아갑니다."})
    finally:
        dbconn.close()


def infochange(request):
    try:
        data = json.loads(request.body)
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        if data["BeforePW"] != list(select(dbconn, "SELECT Password FROM USER WHERE MainID = '{}'".format(request.session["MainID"])))[0][0]:
            return JsonResponse({"state": "f1", "message": "탈퇴를 위해서는 현재 비밀 번호를 입력해야합니다. 입력한 현재 비밀번호가 일치하지 않습니다."})
        for i in select(dbconn,"SELECT MainID FROM USER WHERE ID = '{}'".format(data["ID"])):
            if (i[0] != request.session["MainID"]):
                return JsonResponse({"state": "f2", "message": "이미 존재하는 아이디 입니다."})
        val_tuple = (data["ID"], data["Password"], data["Name"], data["Gender"], data["Address"],
                     data["DateOfBirth"], data["PhoneNumber"], request.session["MainID"])
        merge(dbconn, """UPDATE USER SET ID = %s, Password = %s, Name = %s, Gender = %s, Address = %s,
                         DateOfBirth = %s, PhoneNumber = %s WHERE MainID = %s""", val_tuple)
        del request.session['MainID'], request.session['ID'], request.session['Name']
        dbconn.commit()
        return JsonResponse({"state": "s", "message" : "개인정보가 성공적으로 수정 되었습니다. 수정한 ID와 Password로 다시 로그인 해주십시오."})
    except Exception as e:
        dbconn.rollback()
        if "MainID" in request.session:
            del request.session['MainID']
        if "ID" in request.session:
            del request.session['ID']
        if "Name" in request.session:
            del request.session['Name']
        return JsonResponse({"state": "f3", "message": "오류가 발생했습니다. 로그아웃 되고 로그인 페이지로 돌아갑니다."})
    finally:
        dbconn.close()