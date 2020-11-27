# user

| Column      | 타입        | 다른 특성        | 설명                                                         |
| ----------- | ----------- | ---------------- | ------------------------------------------------------------ |
| MainID      | VARCHAR(20) | PK, Not Null     | [ad(관리자),as(평가자),su(제출자)] + " "(공백) + 랜덤 숫자 및 문자로 구성됨 |
| ID          | VARCHAR(20) | Unique, Not Null | 로그인에 사용되는 ID                                         |
| Password    | VARCHAR(20) | Not Null         |                                                              |
| Name        | VARCHAR(20) | Not Null         |                                                              |
| Gender      | CHAR(1)     | Not Null         |                                                              |
| Address     | TEXT        | Not Null         |                                                              |
| DateOfBirth | DATE        | Not Null         |                                                              |
| PhoneNumber | VARCHAR(11) | Not Null         |                                                              |



# TASK

| Column           | 타입        | 다른 특성        | 설명                                                         |
| ---------------- | ----------- | ---------------- | ------------------------------------------------------------ |
| TaskID           | INT         | PK, AUTO         | 자동으로 만들어지므로 insert할 필요 없음                     |
| SubmissionPeriod | INT         | Not Null         | 제출 주기                                                    |
| TableName        | VARCHAR(40) | Not Null, unique | 이름은 unique 해야함. 띄어쓰기X 영어만 허용. TableName으로 태스크 데이터 테이블을 만들고 TableName + "_W"로 평가전 임시 저장 테이블 만듦 |
| TaskSchema       | TEXT        | Not Null         | 속성이름1%속성1type%속성이름2%속성2type 형태로 저장됨 (구분자는 "%") // 띄어쓰기X 영어만 허용 |
| Name             | VARCHAR(40) | Not Null         | 태스크 이름                                                  |
| Description      | MEDIUMTEXT  | Not Null         | 태스크 설명                                                  |
| TaskThreshold    | TEXT        | Not Null         | 태스크 통과 기준 줄글로 작성                                 |



# ORIGINAL_DATA_TYPE

| Column         | 타입 | 다른 특성 | 설명                                                         |
| -------------- | ---- | --------- | ------------------------------------------------------------ |
| OriginalTypeID | INT  | PK, AUTO  | 자동으로 만들어지므로 insert할 필요 없음                     |
| TaskID         | INT  | Not Null  | 제출 주기                                                    |
| OriginSchema   | TEXT | Not Null  | 오리지널 데이터 타입 이름                                    |
| Mapping        | TEXT | Not Null  | 매핑 정보: 원래열%Task열%원래열%Task열, 오리지널 컬럼 이름 만들때 '%'만 허용하지 않으면 됨 |



# PARSING_DATA

| Column           | 타입         | 다른 특성             | 설명                                                         |
| ---------------- | ------------ | --------------------- | ------------------------------------------------------------ |
| SubmissionID     | INT          | PK, AUTO              | 자동으로 만들어지므로 insert할 필요 없음                     |
| OriginalTypeID   | INT          |                       |                                                              |
| SubmitterID      | VARCHAR(20)  |                       |                                                              |
| AssessorID       | VARCHAR(20)  |                       |                                                              |
| SubmissionNumber | INT          | NOT NULL              | 제출 회차                                                    |
| SubmissionDate   | DATETIME     | NOT NULL              | 제출 일자                                                    |
| StartDate        | DATE         |                       | 데이터 수집 시작일                                           |
| EndDate          | DATE         |                       | 데이터 수집 종료일                                           |
| FileName         | VARCHAR(100) | NOT NULL              | 파일 이름                                                    |
| NumberOfTuple    | INT          | NOT NULL              | 튜플수                                                       |
| QuanAssessment   | DECIMAL(6,4) | NOT NULL              | 정성평가                                                     |
| QualAssessment   | DECIMAL(6,4) |                       | 정량평가                                                     |
| P_NP             | VARCHAR(2)   | NOT NULL, default="W" | P(pass), NP(non pass), W(wait)// 한번 평가하고 나면 바꾸면 안됨 |



# PARTICIPATE_TASK

| Column      | 타입        | 다른 특성 | 설명                                                         |
| ----------- | ----------- | --------- | ------------------------------------------------------------ |
| TaskID      | INT         | PK, AUTO  | 자동으로 만들어지므로 insert할 필요 없음                     |
| SubmitterID | VARCHAR(20) |           | 제출 하는 사람                                               |
| Pass        | VARCHAR(1)  |           | P(태스크 참여 허가), W(태스크 참여 신청 후 대기) NP 경우 테이블에서 삭제 |
