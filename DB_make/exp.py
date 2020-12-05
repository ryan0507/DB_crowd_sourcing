import mysql.connector
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "1246team!", database = "DB_test")

def merge(dbconn, query, values, bufferd=True):
  # 전역에 선언되어 있는 connection을 가져온다.
  try:
    # 커서를 취득한다.
    cursor = dbconn.cursor(buffered=bufferd);
    # 쿼리를 실행한다. values는 query 값에 있는 sql query식의 바인딩 값이다.
    # 문자열 포멧팅으로 설정된다. values는 튜플 값으로 입력된다.
    cursor.execute(query, values);
    # 쿼리를 커밋한다.

  except Exception as e:
    # 에러가 발생하면 쿼리를 롤백한다.
    dbconn.rollback();
    raise e;

print(1)
try:
    merge(dbconn, "INSERT INTO Rest_Rev VALUES (%s, %s, %s, %s, %s)", [6, "학생식당", 1.27, 1, 0])
except Exception as e:
    print(e)
    pass
print(1)
try:
    merge(dbconn, "INSERT INTO Rest_Rev VALUES (%s, %s, %s, %s, %s)", [1,"백종원", 200, 10, 0])
except Exception as e:
    print(e)
    pass
print(2)
try:
    merge(dbconn, "INSERT INTO Rest_Rev VALUES (%s, %s, %s, %s, %s)", [1,"한신포차", 200, 10, 0])
except Exception as e:
    print(e)
    pass
print(3)
dbconn.commit();