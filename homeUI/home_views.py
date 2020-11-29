import json
from django.http import JsonResponse
import mysql.connector
DB_HOST = "34.64.198.135"
DB_ROOT = "root"
DB_PASSWD = "111111"
DB_DATABASE = "DB_test"
def select(dbconn, query, bufferd=True):
  cursor = dbconn.cursor(buffered=bufferd);
  cursor.execute(query);
  return cursor;




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
        dbconn.close();


def GetUser(request):
    try:
        return JsonResponse({"MainID": request.session['MainID'], "ID": request.session['ID'], "Name": request.session['Name']})
    except Exception as e:
        return JsonResponse({"MainID": "-1", "ID": "-1", "Name": "-1"})


def logout(request):
    del request.session['MainID'], request.session['ID'], request.session['Name']
    return JsonResponse({"state" : "You're logged out."})