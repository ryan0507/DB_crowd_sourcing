import mysql.connector
dbconn = mysql.connector.connect(host = "34.64.198.135", user = "root", passwd = "111111", database = "DB_test")

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
tmp.append("DROP TABLE PARTICIPATE_TASK;")
tmp.append("DROP TABLE PARSING_DATA;")
tmp.append("DROP TABLE ORIGINAL_DATA_TYPE;")
tmp.append("DROP TABLE TASK;")
tmp.append("DROP TABLE USER;")
# tmp.append("DROP TABLE Rest_Rev_W;")
# tmp.append("DROP TABLE Rest_Rev;")
# tmp.append("DROP TABLE Float_pop;")
# tmp.append("DROP TABLE Float_pop_W;")


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
TaskID               INT                AUTO_INCREMENT PRIMARY KEY,
SubmissionPeriod     INT                NOT NULL,
TableName            VARCHAR(40)        NOT NULL,
TaskSchema           TEXT               NOT NULL,
Name                 VARCHAR(40)        NOT NULL,
Description          MEDIUMTEXT         NOT NULL,
TaskThreshold        TEXT               NOT NULL,
UNIQUE(TableName)
);
""")
tmp.append(
"""
CREATE TABLE ORIGINAL_DATA_TYPE(
OriginalTypeID       INT                AUTO_INCREMENT PRIMARY KEY,
TaskID               INT                NOT NULL,
OriginSchema         TEXT               NOT NULL,
Mapping              TEXT               NOT NULL,
FOREIGN KEY (TaskID) REFERENCES TASK(TaskID) ON DELETE CASCADE ON UPDATE CASCADE
);
""")
tmp.append(
"""
CREATE TABLE PARSING_DATA(
SubmissionID       INT                AUTO_INCREMENT PRIMARY KEY,
OriginalTypeID     INT        ,
SubmitterID        VARCHAR(20),
AssessorID         VARCHAR(20),
SubmissionNumber   INT                NOT NULL,
SubmissionDate     DATETIME           NOT NULL,
StartDate          DATE,
EndDate            DATE,
FileName           VARCHAR(100)       NOT NULL,
NumberOfTuple      INT                NOT NULL,
QuanAssessment     DECIMAL(6,4)       NOT NULL,
QUalAssessment     DECIMAL(6,4),
P_NP               VARCHAR(2)         NOT NULL    DEFAULT 'W',

FOREIGN KEY (OriginalTypeID) REFERENCES ORIGINAL_DATA_TYPE(OriginalTypeID) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (SubmitterID) REFERENCES USER(MainID) ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY (AssessorID) REFERENCES USER(MainID) ON DELETE SET NULL ON UPDATE CASCADE,
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
TaskID               INT                NOT NULL,
SubmitterID          VARCHAR(20)        NOT NULL,
Pass                 VARCHAR(1)         NOT NULL    DEFAULT 'W',
PRIMARY KEY(SubmitterID, TaskID),
FOREIGN KEY (TaskID) REFERENCES TASK(TaskID) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (SubmitterID) REFERENCES USER(MainID) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT domain_SubmitterID CHECK (SubmitterID LIKE 'su %'),
CONSTRAINT domain_Pass CHECK (Pass = 'P' OR Pass = 'W')
);
""")

try:	
  for s in tmp:
    execute(s)
except Exception as e:	
  print(e);	
finally:
  dbconn.close();

