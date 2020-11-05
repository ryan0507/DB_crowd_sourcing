# 사용 방법

1. 마리아 db 설치
2. my sql client(prompt 창) -> create database DBProject 입력
3. 기존에 DBProject를 만들었고, 안에 테이블이 있는경우 drop table 명령어로 삭제한다.
4. conda 환경에 pip install mysql-connector 설치
5. 주어진 파이썬 파일 제일 윗부분에 본인 패스워드로 변경
6. DDL.py 실행
7. my sql client(prompt 창)에 use DBProject -> show table status 입력하시면 정상적으로 테이블 만들어진것 확인



# 주요 업데이트 사항

2020 11 05

1. VARCHAR(n)로 몇몇 필드는 글자수를 제한했어요. 이거 프론트에 명시해줘야할거 같아요
2. 점수는 정성 정량 모두 0~10점으로 주어지는걸로 계산했어요. 
3. user ID 정의시 띄어쓰기 사용하지 못하게 해주세요!!
4. 스키마 정의시 특수문자 사용하지 못하게 해주세요. 
5. MainID는'ad' or 'as' or 'su' + 공백으로 시작합니다.