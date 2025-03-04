// import React, { Fragment,forwardRef} from 'react';
// import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
// npm install @types/js-cookie

interface User{
    MainID : string,
    ID : string,
    Password : string,
    Name : string,
    Gender : string,
    Address : string,
    DateOfBirth : string,
    PhoneNumber: string,
    age : string,
    role : string,
    Task? : string[],
}

interface Column {
  id: 'ID' | 'name' | 'birth' | 'ages' | 'sex' | 'role' | 'joined' | 'phoneNum' ;
  label: string;
  maxHeight?: number;
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
    joined?: string[];
    phoneNum: string;
}

function createData(user : User[]): Data[] {
    let temp : Data[] = [];

    user.map((item)=>{

        let tempJoined : string[] = [];
        if(item.Task != []){
        item.Task?.map((joined)=>{
            if(joined != null) {tempJoined.push(joined+", ")}
            else {tempJoined.push('-')}
        })}
        temp.push({ID : item.ID, name: item.Name, birth: item.DateOfBirth, ages: item.age+"대", sex: item.Gender, role:item.role, joined: tempJoined, phoneNum: item.PhoneNumber,})
    })
  return temp;
}




export default function Admin_userList() {

    const[_user, setUser] = useState<User[]>([]);

    const getApi = async() =>{
        await axios.get('http://165.132.105.46:3025/adminUI/user').then((r)=>{
            let temp: User[] = r.data;
            setUser(temp);
            // set(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[]);

    const row = createData(_user);

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
                  lookup: { 'M': '남', 'F': '여' }, hideFilterIcon: true, cellStyle: {textAlign:"center",}
                },
                {
                  title: 'role',
                  field: 'role',
                  lookup: { 'submitter': '제출자', 'assessor': '평가자' }, hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                { title: 'joined', field: 'joined', hideFilterIcon: true, cellStyle: {textAlign:"center", maxHeight:"45px",textOverflow: 'clip', whiteSpace: 'nowrap', overflow: 'scroll', maxWidth:"160px"},},
                {title: 'phoneNum', field: 'phoneNum', type:"numeric", hideFilterIcon: true, cellStyle: {textAlign:"center"}},
              ]}
               data={row}
               onRowClick={(event, rowData) => {
                  // Get your id from rowData and use with link.
                  // window.open(`mysite.com/product/${rowData.}`, "_blank")
                  // event.stopPropagation();
                   let tempID : string = ''
                    _user.map((item)=>{
                        // @ts-ignore
                        if(item.ID === rowData.ID){tempID = item.MainID}
                    })
                   // @ts-ignore
                   if(rowData.role === 'submitter') window.location.href="/admin/presenterDetail/"+tempID;
                   // @ts-ignore
                   if(rowData.role === 'assessor') window.location.href="/admin/estimatorDetail/"+tempID;

               }}
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