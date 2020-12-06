# USER

| Column      | 타입        | 기타 특성        | 설명                 |
| ----------- | ----------- | ---------------- | -------------------- |
| MainID      | VARCHAR(20) | PK, Not Null     | key로 사용되는 ID    |
| ID          | VARCHAR(20) | Unique, Not Null | 로그인에 사용되는 ID |
| Password    | VARCHAR(20) | Not Null         | 비밀번호             |
| Name        | VARCHAR(20) | Not Null         | 이름                 |
| Gender      | CHAR(1)     | Not Null         | 성별                 |
| Address     | TEXT        | Not Null         | 주소                 |
| DateOfBirth | DATE        | Not Null         | 생일                 |
| PhoneNumber | VARCHAR(11) | Not Null         | 휴대전화번호         |



# TASK

| Column           | 타입        | 기타 특성        | 설명                                                   |
| ---------------- | ----------- | ---------------- | ------------------------------------------------------ |
| TaskID           | INT         | PK, AUTO         | 자동 생성 key                                          |
| SubmissionPeriod | INT         | Not Null         | 제출 주기                                              |
| TableName        | VARCHAR(40) | Not Null, unique | 대기 테이블 이름: TableName + "_W"                     |
| TaskSchema       | TEXT        | Not Null         | 속성이름1%속성1type%속성이름2%속성2type (구분자는 "%") |
| Name             | VARCHAR(40) | Not Null         | 태스크 이름                                            |
| Description      | MEDIUMTEXT  | Not Null         | 태스크 설명                                            |
| TaskThreshold    | TEXT        | Not Null         | 태스크 통과 기준(줄글로 작성)                          |



# ORIGINAL_DATA_TYPE

| Column         | 타입 | 다른 특성 | 설명                                     |
| -------------- | ---- | --------- | ---------------------------------------- |
| OriginalTypeID | INT  | PK, AUTO  | 자동생성 key                             |
| TaskID         | INT  | Not Null  | TASK 외부키                              |
| OriginSchema   | TEXT | Not Null  | 오리지널 데이터 타입 이름                |
| Mapping        | TEXT | Not Null  | origin열%Task열%origin열%Task열(%구분자) |



# PARSING_DATA

| Column           | 타입         | 다른 특성             | 설명                           |
| ---------------- | ------------ | --------------------- | ------------------------------ |
| SubmissionID     | INT          | PK, AUTO              | 자동생성 key                   |
| OriginalTypeID   | INT          |                       | ORIGINAL_DATA_TYPE 외부키      |
| SubmitterID      | VARCHAR(20)  |                       | User 외부키                    |
| AssessorID       | VARCHAR(20)  |                       | User 외부키                    |
| SubmissionNumber | INT          | NOT NULL              | 제출 회차                      |
| SubmissionDate   | DATETIME     | NOT NULL              | 제출 일자                      |
| StartDate        | DATE         |                       | 데이터 수집 시작일             |
| EndDate          | DATE         |                       | 데이터 수집 종료일             |
| FileName         | VARCHAR(100) | NOT NULL              | 파일 이름                      |
| NumberOfTuple    | INT          | NOT NULL              | 튜플수                         |
| QuanAssessment   | DECIMAL(6,4) | NOT NULL              | 정성평가                       |
| QualAssessment   | DECIMAL(6,4) |                       | 정량평가                       |
| P_NP             | VARCHAR(2)   | NOT NULL, default="W" | P(pass), NP(non pass), W(wait) |



# PARTICIPATE_TASK

| Column      | 타입        | 다른 특성 | 설명                                                         |
| ----------- | ----------- | --------- | ------------------------------------------------------------ |
| TaskID      | INT         | PK, AUTO  | 자동으로 만들어지므로 insert할 필요 없음                     |
| SubmitterID | VARCHAR(20) |           | 제출 하는 사람                                               |
| Pass        | VARCHAR(1)  |           | P(태스크 참여 허가), W(태스크 참여 신청 후 대기), Non-pass의 경우 삭제됨 |



# TASK.TaskName(태스크 데이터 테이블)

| Column       | 타입 | 다른 특성 | 설명                |
| ------------ | ---- | --------- | ------------------- |
| SubmissionID | INT  |           | PARSING_DATA 외부키 |
| TaskSchema   |      |           |                     |



# TASK.TaskName + "_W"(대기 테이블)

| Column       | 타입 | 다른 특성 | 설명                |
| ------------ | ---- | --------- | ------------------- |
| SubmissionID | INT  |           | PARSING_DATA 외부키 |
| TaskSchema   |      |           |                     |



