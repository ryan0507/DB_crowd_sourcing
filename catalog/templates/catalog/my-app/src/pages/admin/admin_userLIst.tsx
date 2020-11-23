// import React, { Fragment,forwardRef} from 'react';
import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface User{
    ID : string;
    Name : string;
    DateOfBirth : string;
    Gender : string;
    PhoneNumber: string;
}

interface Column {
  id: 'ID' | 'name' | 'birth' | 'ages' | 'sex' | 'role' | 'joined' | 'phoneNum' ;
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'ID', label: 'ID'},
  { id: 'name', label: '이름'},
  { id: 'birth', label: '생년월' },
  { id: 'ages',label: '나이대'},
  {id: 'sex',label: '성별'},
  {id: 'role',label: '역할'},
  {id: 'joined',label: '참여중인\u00a0태스크'},
  {id: 'phoneNum',label: '휴대전화'},
];


interface Data {
    ID: string;
    name: string;
    birth: string;
    ages: string;
    sex: string;
    role: string;
    joined: string;
    phoneNum: string;
}

function createData( ID: string, name: string, birth: string ,ages: string, sex: string, role:string, joined:string, phoneNum:string): Data {
  return { ID, name, birth, ages, sex, role, joined, phoneNum };
}


export default function Admin_userList() {
    const[user, setUser] = useState<User[]>([]);
    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/adminUI/').then((r)=>{
            let temp: User[] = r.data;
            setUser(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[]);

    const rows = [
        createData('music_is_my_life', '박선종',  '98.05.07', '20대', '남', '제출자', '음식점', '01011111111'),
        createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
        createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
        createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
        createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
        createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
        createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
    ];

  return (
      <div className={"userList"}>
      <div className="wrapper">
           <div className="Title">회원 List</div>
          <div className={"userTable"}>
           <MaterialTable
               title={""}
              columns={[
                { title: 'ID', field: 'ID' , hideFilterIcon: true, headerStyle:{textAlign:'center'}, cellStyle: {textAlign:"center"}},
                { title: 'name', field: 'name', hideFilterIcon: true, cellStyle: {textAlign:"center"} },
                { title: 'birth', field: 'birth', hideFilterIcon: true, cellStyle: {textAlign:"center"} },
                {
                  title: 'ages',
                  field: 'ages', hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                {
                  title: 'sex',
                  field: 'sex',
                  lookup: { '남': '남', '여': '여' }, hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                {
                  title: 'role',
                  field: 'role',
                  lookup: { '제출자': '제출자', '평가자': '평가자' }, hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                { title: 'joined', field: 'joined', hideFilterIcon: true, cellStyle: {textAlign:"center"}},
                {title: 'phoneNum', field: 'phoneNum', type:"numeric", hideFilterIcon: true, cellStyle: {textAlign:"center"}},
              ]}
              data={rows}
              options={{
                filtering: true,
                  filterRowStyle:{backgroundColor:'#F6F6F6'},
                  headerStyle:{textAlign:'center'},
                  searchFieldStyle:{position:'relative', top:'-38px', backgroundColor:'white', borderRadius:'5px'}
              }}

            />
            </div>
       </div>
      </div>
  );
}