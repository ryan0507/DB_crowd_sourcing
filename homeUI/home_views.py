import json
from django.http import JsonResponse
import mysql.connector
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = "111111"
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
        dbconn.commit()
    except Exception as e:
        dbconn.rollback()
        raise e


def Login(request):
    try:
        data = json.loads(request.body)
        dbconn = mysql.connector.connect(host=DB_HOST, user=DB_ROOT, passwd=DB_PASSWD, database=DB_DATABASE)
        for i in select(dbconn, "SELECT MainID, ID, Name FROM USER WHERE ID = '{}' and Password = '{}'".format(data["ID"], data[
            "Password"])):
            print(i)
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
            return JsonResponse(value_lst, safe=False)
        else:
            print("noData")
            return JsonResponse({})
    except Exception as e:
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
    del request.session['MainID'], request.session['ID'], request.session['Name']
    return JsonResponse({"state" : "You're logged out."})