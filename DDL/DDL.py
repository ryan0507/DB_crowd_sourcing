import mysql.connector
# 마리아db설치하시고 -> create database db_name -> connect 메소드 부분에 패스워드랑 데이터베이스 이름만 바꿔서 사용
# mysql connection을 선언한다. 파라미터는 host는 접속 주소, user는 ID, passwd는 패스워드, database는 접속할 데이터 베이스이다.	
dbconn = mysql.connector.connect(host="localhost", user="root", passwd="2657", database="DBProject")
cs = dbconn.cursor()

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


tmp = []
tmp.append(
"""
CREATE TABLE USER(
MainID       VARCHAR(20)        NOT NULL,    
ID           VARCHAR(20)        NOT NULL,
Password     VARCHAR(20)        NOT NULL,
Name         VARCHAR(20)        NOT NULL,
Gender       CHAR(1)            NOT NULL ,
Address      TEXT               NOT NULL,
DateOfBirth  DATE               NOT NULL,
PhoneNumber  VARCHAR(11)        NOT NULL,
CONSTRAINT domain_Gender CHECK (Gender='M' OR Gender="F"),
CONSTRAINT domain_MainID CHECK (MainID LIKE 'ad %' OR ID LIKE 'as %' OR ID LIKE 'su %'),
PRIMARY KEY(MainID),
UNIQUE(ID)
);
""")
tmp.append(
"""
CREATE TABLE TASK(
TaskID               VARCHAR(20)        NOT NULL,
SubmissionPeriod     INT                NOT NULL,
TableName            VARCHAR(40)        NOT NULL,
TaskSchema           TEXT               NOT NULL,
Name                 VARCHAR(40)        NOT NULL,
Description          MEDIUMTEXT         NOT NULL,
PRIMARY KEY(TaskID),
UNIQUE(TableName)
);
""")
tmp.append(
"""
CREATE TABLE ORIGINAL_DATA_TYPE(
OriginalTypeID       VARCHAR(20)        NOT NULL,
TaskID               VARCHAR(20)        NOT NULL,
OriginSchema         TEXT               NOT NULL,
Mapping              TEXT               NOT NULL,
TaskThreshold        DECIMAL(6,4)       NOT NULL,
CONSTRAINT domain_TaskThreshold CHECK (TaskThreshold >=0 and TaskThreshold <= 10),
PRIMARY KEY(OriginalTypeID),
FOREIGN KEY (TaskID) REFERENCES TASK(TaskID) ON DELETE CASCADE ON UPDATE CASCADE
);
""")
tmp.append(
"""
CREATE TABLE PARSING_DATA(
SubmissionID       VARCHAR(20)        NOT NULL,
OriginalTypeID     VARCHAR(20),
SubmitterID        VARCHAR(20),
AssessorID         VARCHAR(20),
SubmissionNumber   INT                NOT NULL,
SubmissionDate     DATETIME           NOT NULL,
StartDate          DATE,
FileName           VARCHAR(100)       NOT NULL,
EndDate            DATE,
NumberOfTuple      INT                NOT NULL,
QuanAssessment     DECIMAL(6,4)       NOT NULL,
QUalAssessment     DECIMAL(6,4),
P_NP               VARCHAR(2)         NOT NULL    DEFAULT 'W',

FOREIGN KEY (OriginalTypeID) REFERENCES ORIGINAL_DATA_TYPE(OriginalTypeID) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (SubmitterID) REFERENCES USER(MainID) ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY (AssessorID) REFERENCES USER(MainID) ON DELETE SET NULL ON UPDATE CASCADE,
PRIMARY KEY(SubmissionID),
CONSTRAINT domain_QuanAssessment CHECK (QuanAssessment >=0 and QuanAssessment <= 10),
CONSTRAINT domain_QualAssessment CHECK ((QualAssessment >=0 and QualAssessment <= 10) OR QualAssessment IS NULL),
CONSTRAINT domain_P_NP CHECK (P_NP = 'NP' OR P_NP = 'P' OR P_NP = 'W'),
CONSTRAINT domain_SubmitterID CHECK (SubmitterID LIKE 'su %'),
CONSTRAINT domain_AssessorID CHECK (AssessorID LIKE 'as %')
);
""")
tmp.append(
"""
CREATE TABLE PARTICIPATE_TASK(
SubmitterID          VARCHAR(20)        NOT NULL,
TaskID               VARCHAR(20)        NOT NULL,
Pass                 VARCHAR(1)         NOT NULL    DEFAULT 'W',
PRIMARY KEY(OriginalTypeID),
FOREIGN KEY (TaskID) REFERENCES TASK(TaskID) ON DELETE CASCADE ON UPDATE CASCADE
FOREIGN KEY (SubmitterID) REFERENCES USER(MainID) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT domain_SubmitterID CHECK (SubmitterID LIKE 'su %'),
CONSTRAINT domain_Pass CHECK ( Pass = 'P' OR Pass = 'W'),
);
""")

try:	
  for s in tmp[:]:
    execute(s)
except Exception as e:	
  print(e);	
finally:	
  # connection을 다 사용하면 반드시 connection 리소스를 닫는다.	
  dbconn.close();

