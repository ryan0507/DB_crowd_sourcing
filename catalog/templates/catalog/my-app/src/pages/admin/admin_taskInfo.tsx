import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';

import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import React, { Fragment, useEffect, useState} from 'react';
import axios from "axios";
import InputBase from "@material-ui/core/InputBase";
import Admin_tableSchema_add from "./admin_tableSchema_add";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface taskInfo{
    TaskID : string,
    Name : string,
    SubmissionPeriod : number,
    Description: string,
    Threshold : string,
    Task_Schema: schema[],
    OriginalData: TypeList[],
    Participant : userList[],
    Request : requestUser[],
    Statistics : statistic,
}

interface TypeList {
    Name : string;
    Schema : schema[];
}
interface schema{
    id : number,
    Big : string,
    small : string,
}

interface userList {
    UserID : string,
    UserName : string,
    Average : string,
}

interface requestUser {
    UserID : string,
    UserName : string,
    Average : string,
}

interface statistic{
    Files : file[],
    Total : number,
    Pass : number,
}

interface file{
    UserID : string,
    UserName : string,
    OriginSchema : string,
    SubmissionDate : string,
    SubmissionNumber : number,
    FileName : string,
    P_NP : string,
    SubmissionTime : string,
}

interface Column {
  id: 'OriginSchema' | 'SubmissionNumber' | 'SubmissionDate'|  'UserName' | 'FileName' | 'P_NP';
  label: string;
  maxWidth?: number;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'OriginSchema', label: '원본데이터타입',},
    {
    id: 'SubmissionNumber',
    label: '회차',
    minWidth: 90,
  },
  { id: 'SubmissionDate', label: '제출 날짜', minWidth: 80 },

  { id: 'UserName', label: '제출자', minWidth: 80 },
  {
    id: 'FileName',
    label: '제출\u00a0파일명',
    minWidth: 140,
  },
  {
    id: 'P_NP',
    label: 'Pass\u00a0여부',
    minWidth: 100,
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  }
});



interface dataTable {
    id: number,
    valueName: string;
    valueType: string;
}


//datatype Add
// interface Type {
//     id: number;
//     originName: string;
//     decidedName: string;
// }

const defaultValue: schema = {
    id: 0,
    small: '',
    Big: '',
}

type tempValue = {
    name: string;
    type: string;
}

const defaultTempValue: tempValue ={
    name: '',
    type: '',
}



export default function Admin_taskInfo(props : RouteComponentProps<{task_id : string}>,){
    const [info, setInfo] = useState<taskInfo>({TaskID : '', Name: '', SubmissionPeriod: 0, Description: '', Threshold: '', OriginalData: [], Task_Schema : [], Participant: [], Request: [], Statistics: {Files: [],  Total : 0, Pass: 0,}});
    const getApi = async() =>{
        await axios.get(`http://127.0.0.1:8000/adminUI/${props.match.params.task_id}/`).then((r)=>{
            let temp: taskInfo = r.data;
            setInfo(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])


    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const [toggleData, setToggleData] = useState<boolean>(true);
    const handleToggleData = () => {
        setToggleData(!toggleData);
    }
    const [dataTypeList, setDataTypeList] = useState<TypeList[]>([{Name : "", Schema:[]},]);
    const [valueList, setValueList] = useState<dataTable[]>( [{id : 0, valueName : "음식점 이름", valueType: "string"}, {id : 1, valueName : "월 매출", valueType: "integer"}]);
    const [valueCount, setValueCount] = useState<number>(valueList.length + 1);
    const [_list, setList] = useState<schema[]>( []);
    const [_name, setName] = useState<string>("");
    const [typeCount, setTypeCount] = useState<number>(dataTypeList.length+1);
    const [count, setCount] = useState<number>(1);
      const [_Value, setValue] = useState(defaultValue);
      // const [_list, setList] = useState()
      const pushButton = <P extends keyof tempValue>(prop:P, x : any) => setTempValue({..._tempValue, [prop] : x});
      const [_tempValue, setTempValue] = useState(defaultTempValue);
      const onValueChange =<P extends keyof tempValue> (prop: P, value: tempValue[P]) =>
      {
          setTempValue({..._tempValue, [prop]: value});
      }
      const onTypeNameChange = (value : string) =>{
          setName(value);
    }
      const handleSubmit = (e:any) =>{
          e.preventDefault();
          let exist : boolean = false;
          _list.map((item)=>{
              if(item.small === _tempValue.type){exist = true;}
          })
          if(!exist){
              let content : schema ={
                  id: count,
                  small: _tempValue.type,
                  Big: _tempValue.name,
              };
              setCount(count + 1);
              let l : schema[] = Object.assign([], _list);
              l.push(content);
              setList(l);
          }else(alert("이미 선택한 태스크 데이터 테이블 속성입니다."))

      }
      const datatypeList = _list.map((item) => {
        return (
          <div key={item.id}>
              <li>
                  <div className={"dataName"}>{item.Big}</div>
                  <div className={"dataType"}>{item.small}</div>
                  <div><button className={"deleteButton"} onClick={e => handleRemove(item.id)}>[삭제하기]</button></div>
              </li>
          </div>
        );
      });
      const handleRemove = (id: number) => {
          let l : schema[] = [];
          _list.map((content) => {
              if(content.id !== id){
                  l.push(content);
              }
          });
          setList(l);
      }
      const handleTypeRemove = (name: string) => {
          let l : TypeList[] = [];
          info.OriginalData.map((content) => {
              if(content.Name !== name){
                  l.push(content);
              }
          });
          setInfo({...info, ["OriginalData"]: l});
        }
    const handleTypeSubmit = (e:any) =>{
          e.preventDefault();
          let exist : boolean = false;
          info.OriginalData.map((item)=>{
              if(item.Name === _name){
              exist = true;}
          })
          if(!exist){
          let content : TypeList ={
                  Name: _name,
                  Schema: _list,
              };
              setTypeCount(typeCount + 1);
              let l : TypeList[] = Object.assign([], info.OriginalData);
              l.push(content);
              setInfo({...info, ["OriginalData"] : l});
              setList([]);
              setCount(1);
          }else(alert("이미 존재하는 원본 데이터 타입 이름입니다."))
      }

      // const [userNum, setUserNum] = useState<number>(0);
      // const [requestUserNum, setRequestUserNum] = useState<number>(0);

      let userNum : number = 0;
      let requestUserNum : number = 0;

      const handleClickYes = (e :React.MouseEvent<HTMLButtonElement, MouseEvent>, userID : string) =>{
          e.preventDefault();
          let tempUserList : userList[] = Object.assign([], info.Participant);
          let tempRequestUser : requestUser[] = [];

          info.Request.map((user)=>{
              if(userID !== user.UserID){tempRequestUser.push(user)}
              else{tempUserList.push(user)}
          })
          setInfo({...info,["Participant"]: tempUserList, ["Request"]: tempRequestUser})

          _axiosPost(tempUserList, tempRequestUser);
      }
      const _axiosPost = (tempUserList : userList[], tempRequestUser : requestUser[]) => {
          axios.post(`http://127.0.0.1:8000/adminUI/${props.match.params.task_id}/`, {
                TaskID : info.TaskID,
                Name : info.Name,
                SubmissionPeriod : info.SubmissionPeriod,
                Description: info.Description,
                Threshold : info.Threshold,
                Task_Schema : info.Task_Schema,
                OriginalData : info.OriginalData,
                Participant : tempUserList,
                Request : tempRequestUser,
                Statistics : info.Statistics,
            }).then((r) => {
                console.log(tempUserList);
                console.log(r);
                console.log(r.data);
                console.log('hhhhhhhhhhhhhhhh');
            }).catch((err) => {
                 console.log(err.response.data);
                 console.log(err.response.status);
                 console.log(err.response.headers); } )
    }
    const handleClickNo = (e :React.MouseEvent<HTMLButtonElement, MouseEvent>, userID : string) =>{
          e.preventDefault();
          let tempRequestUser : requestUser[] = [];

          info.Request.map((user)=>{
              if(userID !== user.UserID){tempRequestUser.push(user)}
          })
        console.log(info.Request)
          setInfo({...info, ["Request"]: tempRequestUser})
          _axiosPost(info.Participant, tempRequestUser);
      }

   return(
       <div className={"taskInfo"}>
       <div className="wrapper">
           <div className="Title">{info.Name}</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"task_info"}>
                   <div className={"wrapper_title"}>태스크 설명</div>
                   <div className={"lightgray_wrapper"}>{info.Description}</div>
               </div>

               <div className={"task_howToPass"}>
                   <div className={"wrapper_title"}>태스크 PASS 기준</div>
                   <div className={"lightgray_wrapper"}>{info.Threshold}</div>
               </div>

               <div className={"Submission_Period"}>
                   <div className={"wrapper_title"}>최소 업로드 주기</div>
                   <div className={"lightgray_wrapper"}> {info.SubmissionPeriod} 일</div>
               </div>


               <div className={"dataTableSchema"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                       <ul className={"dataTableSchema_list"}>
                           {info.Task_Schema.map((item) =>{
                               return(
                                   <li>
                                       {item.Big}
                                       <div className={"valueType"}>{item.small}</div>
                               </li>);
                           })}
                       </ul>
               </div>


               <div className={"originDataType_add"}>
                   <div className={"wrapper_title"}>원본 데이터 타입</div>
                   <button className={"addDataTypeButton"} onClick={handleToggleData}>
                       {toggleData ? (<Fragment>원본 데이터 타입 추가</Fragment>) : (<Fragment>원본 데이터 타입 저장</Fragment>)}
                   </button>
                   {toggleData ? (
                       <ul className={"datatype_list"}>
                           {info.OriginalData.map((list)=>{
                               return(
                              <li className={"dataVertical"}>
                                  <div className={"datatypeID"}>[{list.Name}] : </div>
                               {list.Schema.map((item) =>{
                                   return(
                                        <ul className={"value_list"}>
                                               <li>
                                                   <div className={"decidedName"}>{item.Big}</div>
                                                   <div className={"originName"}>{item.small}</div>
                                               </li>
                                        </ul>
                                   );
                               })}
                               </li> );
                           })}

                       </ul>
                   ) : (
                       <div className={"admin_datatype_add"}>

                           <ul className={"datatype_list"}>
                               {info.OriginalData.map((list)=>{
                                   return(
                                  <li className={"dataVertical"}>
                                       <div className={"datatypeID"}>[{list.Name}] : </div>
                                   {list.Schema.map((item) =>{
                                       return(
                                            <ul className={"value_list"}>
                                                   <li>
                                                       <div className={"decidedName"}>{item.Big}</div>
                                                       <div className={"originName"}>{item.small}</div>
                                                   </li>
                                            </ul>
                                       );
                                   })}
                                   <div><button className={"deleteButton"} onClick={e => handleTypeRemove(list.Name)}>[삭제하기]</button></div>
                                   </li> );
                               })}

                           </ul>
                           <div className={"datatypeName"}>
                               <div className={"typeNameWord"}>원본 데이터 타입 이름 :</div>
                               <InputBase
                                  className={"datatypeNameInput"}
                                  placeholder="해당 원본 데이터 타입의 이름을 작성해주세요"
                                  inputProps={{ 'aria-label': '원본 데이터 타입' }}
                                  value={_name}
                                  onChange={e=> {
                                      onTypeNameChange(e.target.value)
                                  }}
                                />
                           </div>
                           <div className={"valueList"}>
                               {info.Task_Schema.map((item)=>{
                                   return(<button className="valueName" onClick={e => pushButton('type', item.Big)}>{item.Big}</button>);
                               })}
                          </div>
                          <div className={"datatypeInput"}>
                                <div className={"small_lightgray_wrapper"}>{_tempValue.type}</div>

                                <InputBase
                                  className={"datatypeValueName"}
                                  placeholder="해당 원본 데이터 타입 속성 이름을 작성해주세요"
                                  inputProps={{ 'aria-label': '원본 데이터 타입' }}
                                  value={_tempValue.name}
                                  onChange={e=> {
                                      onValueChange('name', e.target.value)
                                  }}
                                />
                              <form className="input" onClick={e => handleSubmit(e)}>
                                  <button className={"short"} type="submit">추가</button>
                              </form>
                          </div>
                      <div className={"datatypeList"}><ul className={"decimalList"}>{datatypeList}</ul></div>
                       <form className="input" onClick={e => handleTypeSubmit(e)}>
                          <button className={"long"} type="submit">원본 데이터타입 추가</button>
                      </form>

                       </div>
                   )}
               </div>
               <div className={"presenters"}>
                   <div className={"wrapper_title"}>참여자 명단</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"name"}>이름</div>
                       <div className={"score"}>평가점수</div>
                       <ul className={"applicants"}>
                           {
                               info.Participant.map((item)=>{
                                   return(
                                       <li>
                                           <div className={"sequenceNum"}>{++userNum}.</div>
                                           <div className={"personal_name"}>{item.UserName}</div>
                                           <div className={"personal_score"}>{item.Average}점</div>
                                       </li>
                                   );

                               }
                           )}
                       </ul>
                   </div>
               </div>

               <div className={"applicantList"}>
                   <div className={"wrapper_title"}>참여 신청자 명단</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"name"}>이름</div>
                       <div className={"score"}>평가점수</div>
                       <ul className={"applicants"}>
                           {
                               info.Request.map((item)=>{
                                   return(
                                       <li>
                                           <div className={"sequenceNum"}>{++requestUserNum}.</div>
                                           <div className={"personal_name"}>{item.UserName}</div>
                                           <div className={"personal_score"}>{item.Average}점</div>
                                           <div className={"YesNo"}>
                                               <button className={"_button"} id={"yes"} onClick={(e)=> handleClickYes(e, item.UserID)}>승인</button>
                                               <button className={"_button"} id={"no"} onClick={(e)=> handleClickNo(e, item.UserID)}>거절</button>
                                           </div>
                                       </li>
                                   );

                               }
                           )}
                       </ul>
                   </div>
               </div>

               <div className={"taskStatistic"}>
                   <div className={"wrapper_title"}>태스크 통계</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"submitFiles"}>제출된 파일 수 : {info.Statistics.Total}개</div>
                       <div className={"passFiles"}>Pass된 파일 수 : {info.Statistics.Pass}개</div>
                       <div className={"passTuples"}>Pass된 튜플 수 : 000개</div>
                       <Paper className={classes.root}>
                          <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  {columns.map((column) => (
                                    <TableCell
                                      key={column.id}
                                      align={'center'}
                                      style={{ minWidth: column.minWidth, backgroundColor: 'white', fontSize: '16px', fontWeight: 'bold' }}
                                    >
                                      {column.label}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {info.Statistics.Files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                  return (
                                    <TableRow hover role="checkbox" tabIndex={-1} >
                                      {columns.map((column) => {
                                        const value = row[column.id];
                                        if (column.id == "FileName"){
                                           return (
                                              <TableCell key={column.id} align='center'
                                                  style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                    <Link to ="/admin/filedetail">
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </Link>
                                              </TableCell>
                                            );
                                        }else if(column.id =="UserName"){
                                          return (
                                              <TableCell key={column.id} align='center'
                                                  style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                    <Link to = {`/admin/presenterDetail/${row.UserID}`}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </Link>
                                              </TableCell>);
                                        }else if(column.id == "P_NP" && value == "W"){
                                            return(
                                                <TableCell key={column.id} align='center'
                                                  style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                    평가 전
                                              </TableCell>
                                            );
                                        } else{
                                            return (
                                              <TableCell key={column.id} align='center'
                                              style={{fontSize: '14px', fontWeight: 'normal' }}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                              </TableCell>
                                            );
                                        }
                                      })}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[10, 20, 30]}
                            component="div"
                            count={info.Statistics.Files.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                          />
                        </Paper>
                   </div>
               </div>
           </div>
       </div>
       </div>
   );
}
