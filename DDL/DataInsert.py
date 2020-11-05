import mysql.connector
# 마리아db설치하시고 -> create database db_name -> connect 메소드 부분에 패스워드랑 데이터베이스 이름만 바꿔서 사용
# mysql connection을 선언한다. 파라미터는 host는 접속 주소, user는 ID, passwd는 패스워드, database는 접속할 데이터 베이스이다.	
dbconn = mysql.connector.connect(host="localhost", user="root", passwd="2657", database="DBProject")
cs = dbconn.cursor()

# DML(Data Manipulation Language)의 insert, update, delete를 대랑 처리하는 함수	
def merge_bulk(query, values, bufferd=True):	
  # 전역에 선언되어 있는 connection을 가져온다.	
  global dbconn;	
  try:	
    # 커서를 취득한다. 	
    cursor = dbconn.cursor(buffered=bufferd);	
    # 쿼리를 실행한다. values는 query 값에 있는 sql query식의 바인딩 값이다.	
    # 문자열 포멧팅으로 설정된다. values는 리스트 튜플 값으로 입력된다.	
    cursor.executemany(query, values);	
    # 쿼리를 커밋한다.	
    dbconn.commit();	
  except Exception as e:	
    # 에러가 발생하면 쿼리를 롤백한다.	
    dbconn.rollback();	
    raise e;	


try:
  values = [('ad 0','admin', 'admin', 'admin', 'M', 'admin', '2020-11-05', '01000000000')]
  merge_bulk("INSERT INTO USER VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", values)
except Exception as e:	
  print(e);	
finally:	
  dbconn.close()
