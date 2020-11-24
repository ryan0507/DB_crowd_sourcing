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
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
interface taskInfo{
    TaskID : string;
    SubmissionPeriod : number;
    TableName : string;
    TaskSchema : string;
    Name : string;
    Description: string;
}

interface Column {
  id: 'name' | 'date' | 'time' | 'fileName' | 'pNp';
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: '제출자', minWidth: 80 },
  { id: 'date', label: '제출일', minWidth: 80 },
  {
    id: 'time',
    label: '제출시간',
    minWidth: 90,
  },
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
  name: string;
  date: string;
  time: string;
  fileName: string;
  pNp: string;
}

function createData( name: string, date: string, time: string,fileName: string, pNp: string): Data {
  return { name, date, time, fileName, pNp };
}

const rows = [
  createData('박선종', '20.11.01', '23 : 15 : 20', '음악은_즐거워.csv', 'Non-pass'),
  createData('조민주', '20.11.02', '23 : 15 : 30', '새마을식당_10월.csv', 'Pass'),
];

export default function Admin_taskInfo(props : RouteComponentProps<{task_id : string}>,){
    const [info, setInfo] = useState<taskInfo>({TaskID : '', SubmissionPeriod: 0, TableName:'', TaskSchema: '', Name: '', Description: ''});
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
   return(
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
                   <div className={"lightgray_wrapper"}>{info.SubmissionPeriod} 일</div>
               </div>

               <div className={"originDataType"}>
                   <div className={"wrapper_title"}>원본 데이터 타입</div>
                   <Link className={"addDataType"} to = "/admin/datatypeadd_exist">원본 데이터 타입 추가하기</Link>
                   <ul className={"datatype_list"}>
                       <li>
                           <div className={"datatypeID"}>ID : 001</div>
                           <ul className={"value_list"}>
                               <li>
                                   <div className={"decidedName"}>음식점 이름</div>
                                   <div className={"originName"}>음식점 이름</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 매출</div>
                                   <div className={"originName"}>월 매출</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 고객 수</div>
                                   <div className={"originName"}>월 고객 수</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 순이익</div>
                                   <div className={"originName"}>월 순이익</div>
                               </li>
                           </ul>
                       </li>
                   </ul>

               </div>

               <div className={"originDataTypeRequest"}>
                   <div className={"wrapper_title"}>원본 데이터 타입 요청</div>
                   <ul className={"datatype_list"}>
                       <li>
                           <div className={"datatypeID"}>ID : 001</div>
                           <ul className={"value_list"}>
                               <li>
                                   <div className={"decidedName"}>음식점 이름</div>
                                   <div className={"originName"}>음식점 이름</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 매출</div>
                                   <div className={"originName"}>월 매출</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 고객 수</div>
                                   <div className={"originName"}>월 고객 수</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 순이익</div>
                                   <div className={"originName"}>월 순이익</div>
                               </li>

                           </ul>
                           <button className={"_button"} id={"yes"}>승인</button>
                           <button className={"_button"} id={"no"}>거절</button>
                       </li>
                   </ul>
               </div>

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
                   //참여자 명단, 제출자 점수
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.time}>
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
   );
}
