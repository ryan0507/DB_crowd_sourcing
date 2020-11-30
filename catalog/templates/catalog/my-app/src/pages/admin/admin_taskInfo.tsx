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
    Description: string,
}

interface Column {
  id: 'dataType'| 'dataNum' | 'name' | 'fileName' | 'pNp';
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'dataType', label: '원본데이터타입', minWidth: 80 },
  {
    id: 'dataNum',
    label: '회차',
    minWidth: 90,
  },
  { id: 'name', label: '제출자', minWidth: 80 },
  {
    id: 'fileName',
    label: '제출\u00a0파일명',
    minWidth: 140,
  },
  {
    id: 'pNp',
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


interface Data {
    dataType : string,
    dataNum : string,
    name: string;
    fileName: string;
    pNp: string;
}

function createData( dataType : string, dataNum: string, name: string, fileName: string, pNp: string): Data {
  return { dataType, dataNum, name,  fileName, pNp };
}

const rows = [
  createData("", "",  '박선종',  '음악은_즐거워.csv', 'Non-pass'),
  createData( "", "",'조민주', '새마을식당_10월.csv', 'Pass'),
];



interface dataTable {
    id: number,
    valueName: string;
    valueType: string;
}
type tempDataTable = {
    name: string;
    type: string;
}

const defaultTempDataTable: tempDataTable ={
    name: '',
    type: '',
}


//datatype Add
interface Type {
    id: number;
    originName: string;
    decidedName: string;
}
interface TypeList {
    name : string;
    types : Type[];
}
const defaultValue: Type = {
    id: 0,
    originName: '',
    decidedName: '',
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
    const [info, setInfo] = useState<taskInfo>({TaskID : '', Name: '', Description: ''});
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
    const [dataTypeList, setDataTypeList] = useState<TypeList[]>([
        {name : "기본 음식점", types:[{id:0, originName:'음식점 이름',decidedName:'음식점 이름'},
                {id:0, originName:'월 매출',decidedName:'월 매출'},
                {id:0, originName:'월 고객 수',decidedName:'월 고객 수'},
                {id:0, originName:'월 순이익',decidedName:'월 순이익'}]},
        ]);
    const [valueList, setValueList] = useState<dataTable[]>( [{id : 0, valueName : "음식점 이름", valueType: "string"}, {id : 1, valueName : "월 매출", valueType: "integer"}]);
    const [valueCount, setValueCount] = useState<number>(valueList.length + 1);
    const [_list, setList] = useState<Type[]>( []);
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
          let content : Type ={
              id: count,
              originName: _tempValue.type,
              decidedName: _tempValue.name,
          };
          setCount(count + 1);
          let l : Type[] = Object.assign([], _list);
          l.push(content);
          setList(l);
          e.preventDefault();
      }
      const datatypeList = _list.map((item) => {
        return (
          <div key={item.originName}>
              <li>
                  <div className={"dataName"}>{item.decidedName}</div>
                  <div className={"dataType"}>{item.originName}</div>
                  <div><button className={"deleteButton"} onClick={e => handleRemove(item.id)}>[삭제하기]</button></div>
              </li>
          </div>
        );
      });
      const handleRemove = (id: number) => {
          let l : Type[] = [];
          _list.map((content) => {
              if(content.id !== id){
                  l.push(content);
              }
          });
          setList(l);
      }
      const handleTypeRemove = (name: string) => {
          let l : TypeList[] = [];
          dataTypeList.map((content) => {
              if(content.name !== name){
                  l.push(content);
              }
          });
          setDataTypeList(l);
        }
    const handleTypeSubmit = (e:any) =>{
          let content : TypeList ={
              name: _name,
              types: _list,
          };
          setTypeCount(typeCount + 1);
          let l : TypeList[] = Object.assign([], dataTypeList);
          l.push(content);
          setDataTypeList(l);
          e.preventDefault();
          setList([]);
          setCount(1);
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
                   <div className={"lightgray_wrapper"}>이 태스크는 이렇게 해야 통과되는 태스크입니다.</div>
               </div>

               <div className={"Submission_Period"}>
                   <div className={"wrapper_title"}>최소 업로드 주기</div>
                   <div className={"lightgray_wrapper"}> -- 일</div>
               </div>


               <div className={"dataTableSchema"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                       <ul className={"dataTableSchema_list"}>
                           {valueList.map((item) =>{
                               return(<li>{item.valueName}
                                   <div className={"valueType"}>{item.valueType}</div>
                               </li>)
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
                           {dataTypeList.map((item) =>{
                               return(
                                   <li className={"dataVertical"}>
                                       <div className={"datatypeID"}> [{item.name}] :</div>
                                        <ul className={"value_list"}>
                                       {item.types.map((type) =>{
                                           return(
                                               <li>
                                                   <div className={"decidedName"}>{type.decidedName}</div>
                                                   <div className={"originName"}>{type.originName}</div>
                                               </li>);
                                       })}
                                        </ul>
                                   </li>);
                           })}
                   </ul>
                   ) : (
                       <div className={"admin_datatype_add"}>

                           <ul className={"datatype_list"}>
                               {dataTypeList.map((item) =>{
                                   return(
                                       <li className={"dataVertical"}>
                                           <div className={"datatypeID"}>[{item.name}] : </div>
                                            <ul className={"value_list"}>
                                           {item.types.map((type) =>{
                                               return(
                                                   <li>
                                                       <div className={"decidedName"}>{type.decidedName}</div>
                                                       <div className={"originName"}>{type.originName}</div>
                                                   </li>);
                                           })}
                                            </ul>
                                           <div><button className={"deleteButton"} onClick={e => handleTypeRemove(item.name)}>[삭제하기]</button></div>
                                       </li>
                                   );
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
                               {valueList.map((item)=>{
                                   return(<button className="valueName" onClick={e => pushButton('type', item.valueName)}>{item.valueName}</button>);
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
                           <li>
                               <div className={"sequenceNum"}>1.</div>
                               <div className={"personal_name"}>한채은</div>
                               <div className={"personal_score"}>8점</div>
                           </li>
                           <li>
                               <div className={"sequenceNum"}>2.</div>
                               <div className={"personal_name"}>이수현</div>
                               <div className={"personal_score"}>3점</div>
                           </li>
                       </ul>
                   </div>
               </div>

               {/*<div className={"originDataTypeRequest"}>*/}
               {/*    <div className={"wrapper_title"}>원본 데이터 타입 요청</div>*/}
               {/*    <ul className={"datatype_list"}>*/}
               {/*        <li>*/}
               {/*            <div className={"datatypeID"}>ID : 001</div>*/}
               {/*            <ul className={"value_list"}>*/}
               {/*                <li>*/}
               {/*                    <div className={"decidedName"}>음식점 이름</div>*/}
               {/*                    <div className={"originName"}>음식점 이름</div>*/}
               {/*                </li>*/}
               {/*                <li>*/}
               {/*                    <div className={"decidedName"}>월 매출</div>*/}
               {/*                    <div className={"originName"}>월 매출</div>*/}
               {/*                </li>*/}
               {/*                <li>*/}
               {/*                    <div className={"decidedName"}>월 고객 수</div>*/}
               {/*                    <div className={"originName"}>월 고객 수</div>*/}
               {/*                </li>*/}
               {/*                <li>*/}
               {/*                    <div className={"decidedName"}>월 순이익</div>*/}
               {/*                    <div className={"originName"}>월 순이익</div>*/}
               {/*                </li>*/}

               {/*            </ul>*/}
               {/*            <button className={"_button"} id={"yes"}>승인</button>*/}
               {/*            <button className={"_button"} id={"no"}>거절</button>*/}
               {/*        </li>*/}
               {/*    </ul>*/}
               {/*</div>*/}

               <div className={"applicantList"}>
                   <div className={"wrapper_title"}>참여 신청자 명단</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"name"}>이름</div>
                       <div className={"score"}>평가점수</div>
                       <ul className={"applicants"}>
                           <li>
                               <div className={"sequenceNum"}>1.</div>
                               <div className={"personal_name"}>한채은</div>
                               <div className={"personal_score"}>8점</div>
                               <button className={"_button"} id={"yes"}>승인</button>
                               <button className={"_button"} id={"no"}>거절</button>
                           </li>
                           <li>
                               <div className={"sequenceNum"}>2.</div>
                               <div className={"personal_name"}>이수현</div>
                               <div className={"personal_score"}>3점</div>
                               <button className={"_button"} id={"yes"}>승인</button>
                               <button className={"_button"} id={"no"}>거절</button>
                           </li>
                       </ul>
                   </div>
               </div>

               <div className={"taskStatistic"}>
                   <div className={"wrapper_title"}>태스크 통계</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"submitFiles"}>제출된 파일 수 : {rows.length}개</div>
                       <div className={"passFiles"}>Pass된 파일 수 : 0개</div>
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
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                  return (
                                    <TableRow hover role="checkbox" tabIndex={-1} >
                                      {columns.map((column) => {
                                        const value = row[column.id];
                                        if (column.id == "fileName"){
                                           return (
                                              <TableCell key={column.id} align='center'
                                                  style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                    <Link to ="/admin/filedetail">
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </Link>
                                              </TableCell>
                                            );
                                        }else if(column.id =="name"){
                                          return (
                                              <TableCell key={column.id} align='center'
                                                  style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                    <Link to ="/admin/presenterDetail">
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </Link>
                                              </TableCell>);
                                        }else{
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
                            count={rows.length}
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
