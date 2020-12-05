import mysql.connector
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "1246team!", database = "DB_test")

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

def execute(query, bufferd=True):
  # 전역에 선언되어 있는 connection을 가져온다.
  global dbconn;
  try:
    # 커서를 취득한다.
    cursor = dbconn.cursor(buffered=bufferd);
    # 쿼리를 실행한다.
    cursor.execute(query);
    # 쿼리를 커밋한다.
    dbconn.commit();
  except Exception as e:
    # 에러가 발생하면 쿼리를 롤백한다.
    dbconn.rollback();
    raise e;
if (True):
# try:
  values = [('ad 1', 'admin', 'admin', 'admin', 'M', '서울특별시', '1997.06.30', '01012341231'),
            ('su 2', 'ljh0001', 'ljh0001', '이재훈', 'M', '경상남도', '1998.01.27', '01012341232'),
            ('su 3', 'jmj0002', 'jmj0002', '조민주', 'F', '경상북도', '2000.01.01', '01012341233'),
            ('su 4', 'psj0003', 'psj0003', '박선종', 'M', '충청북도', '1988.05.07', '01012341234'),
            ('as 5', 'lsh0004', 'lsh0004', '이수현', 'F', '강원도', '2001.07.03', '01012341235'),
            ('as 6', 'sec0005', 'sec0005', '성은채', 'F', '전라남도', '1998.09.03', '01012341236'),
            ('as 7', 'hce0006', 'hce0006', '한채은', 'F', '경기도', '1998.09.03', '01012341237')]
  merge_bulk("INSERT INTO USER VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", values)

  values = [('20', 'Rest_Rev', 'Name%string%Rev%float%Pop%integer%Pas%boolean', '식당 매출', '식당 매출 정보를 파악', 'null 값 50% 이하'),
            ('10', 'Float_pop', 'Loc%string%Tem%float%Fpop%integer%Lpop%integer', '유동 인구', '한반도의 유동인구를 파악', 'tuple 10개이상')]
  merge_bulk("INSERT INTO TASK(SubmissionPeriod, TableName, TaskSchema, Name, Description, TaskThreshold) VALUES (%s, %s, %s, %s, %s, %s)", values)

  values = [('1', '서울식당', '서울식당이름%Name%판매량%Rev%손님수%Pop%정부지원%Pas'),
            ('1', '경남식당', '경남식당이름%Name%판매량%Rev%경남자치단체지원%Pas'),
            ('2', '서울유동인구', '서울지역%Loc%서울기온%Tem%서울유동인구%Fpop%서울지역인구%Lpop'),
            ('2', '한국유동인구', '지역%Loc%기온%Tem%유동인구%Fpop')]
  merge_bulk("INSERT INTO ORIGINAL_DATA_TYPE(TaskID, OriginSchema, Mapping) VALUES (%s, %s, %s)", values)

  values = [('1', 'su 2', 'as 5', '1', '2020,11.01', '2020,11.01', '2020,12.01', '서식.csv', '2', '8.9', '8', 'P'),
            ('2', 'su 3', 'as 6', '1', '2020,11.02', '2020,11.02', '2020,12.02', '경식.csv', '3', '1', '2', 'NP'),
            ('3', 'su 4', 'as 7', '1', '2020,11.03', '2020,11.03', '2020,12.03', '서유.csv', '3', '5', '3', 'NP'),
            ('4', 'su 2', 'as 5', '2', '2020,11.28', '2020,11.04', '2020,12.04', '한유.csv', '2', '7.9', '4', 'P'),
            ('3', 'su 4', 'as 6', '2', '2020,11.29', '2020,11.05', '2020,12.05', '서유2.csv', '3', '10', '', 'W'),
            ('2', 'su 3', 'as 7', '2', '2020,11.30', '2020,11.06', '2020,12.06', '경식2.csv', '2', '1.2', '', 'W')]
  merge_bulk("INSERT INTO PARSING_DATA(OriginalTypeID, SubmitterID, AssessorID, SubmissionNumber, SubmissionDate, StartDate, EndDate, FileName, NumberOfTuple, QuanAssessment, QUalAssessment, P_NP) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", values)

  values = [('su 2', '1', 'P'),
            ('su 3', '1', 'P'),
            ('su 4', '2', 'P'),
            ('su 2', '2', 'P'),
            ('su 4', '1', 'W'),
            ('su 3', '2', 'W')]
  merge_bulk("INSERT INTO PARTICIPATE_TASK(SubmitterID, TaskID, Pass) VALUES (%s, %s, %s)",values)

  execute("""
    CREATE TABLE Rest_Rev(
    SubmissionID INT,
    Name         VARCHAR(50),
    Rev          FLOAT,
    Pop          INT,
    Pas           INT check (Pas = 0 or Pas = 1),
    PRIMARY KEY(Name, Rev, Pop, Pas)
    );""")

  execute("""
      CREATE TABLE Rest_Rev_W(
      SubmissionID INT,
      Name         VARCHAR(50),
      Rev          FLOAT,
      Pop          INT,
      Pas           INT check (Pas = 0 or Pas = 1),
      PRIMARY KEY(SubmissionID, Name, Rev, Pop, Pas)
      );""")

  values = [("1", "새마을 식당", "50.27", "10", "1"),
            ("1", "한신포차", "200", "10", "0")]
  merge_bulk("INSERT INTO Rest_Rev VALUES (%s, %s, %s, %s, %s)", values)
  values = [("6", "홍콩반점", "20", "20", "0"),
            ("6", "학생식당", "1.27", "1", "0")]
  merge_bulk("INSERT INTO Rest_Rev_W VALUES (%s, %s, %s, %s, %s)", values)


  execute("""
    CREATE TABLE Float_pop(
    SubmissionID INT,
    Loc          VARCHAR(50),
    Tem          FLOAT,
    Fpop         INT,
    Lpop           INT,
    PRIMARY KEY(Loc, Tem, Fpop, Lpop)
    );""")

  execute("""
    CREATE TABLE Float_pop_W(
    SubmissionID INT,
    Loc          VARCHAR(50),
    Tem          FLOAT,
    Fpop         INT,
    Lpop           INT,
    PRIMARY KEY(SubmissionID, Loc, Tem, Fpop, Lpop)
    );""")
  values = [("4", "강남", "18", "10", "30"),
            ("4", "강서", "28", "20", "50")]
  merge_bulk("INSERT INTO Float_pop VALUES (%s, %s, %s, %s, %s)", values)
  values = [("5", "경남", "30", "12", "14"),
            ("5", "통영", "30", "13", "15")]
  merge_bulk("INSERT INTO Float_pop_W VALUES (%s, %s, %s, %s, %s)", values)

# except Exception as e:
#   print(e);
# finally:
#   dbconn.close()
