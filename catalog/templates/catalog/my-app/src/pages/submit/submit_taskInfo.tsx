import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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

export default function Submit_taskInfo(){
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
       <div className="submit_taskInfo">
           <div className="wrapper">
               <div className="Title">태스크 이름</div>
               <Link to = "/submit/main" className="right_side_small">뒤로가기</Link>
               <div className="formContent">
                   <div className={"TaskName"}>
                       <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                       <div className={"lightgray_wrapper"}>이름</div>
                   </div>
                   <div className={"TaskInfo"}>
                       <div className={"wrapper_title"}>태스크 설명</div>
                       <div className={"lightgray_wrapper"}>이 태스크는 이런 태스크입니다.</div>
                   </div>
                   <div className={"TaskPassStandard"}>
                       <div className={"wrapper_title"}>태스크 PASS 기준</div>
                       <div className={"lightgray_wrapper"}>패스 기준</div>
                   </div>
                   <div className={"MinUpload"}>
                       <div className={"wrapper_title"}>최소 업로드 주기</div>
                       <div className={"lightgray_wrapper"} >00일</div>
                   </div>
                   <div className={"TaskSchema"}>
                       <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                       <ul className={"datatype_list"}>
                           <li>
                               <ul className={"value_list"}>
                                   <li>
                                       <div className={"name"}>음식점 이름</div>
                                       <div className={"type"}>(String)</div>
                                   </li>
                                   <li>
                                       <div className={"name"}>월매출</div>
                                       <div className={"type"}>(Int)</div>
                                   </li>
                                   <li>
                                       <div className={"name"}>월 고객 수</div>
                                       <div className={"type"}>(Int)</div>
                                   </li>
                                   <li>
                                       <div className={"name"}>월 순이익</div>
                                       <div className={"type"}>(Int)</div>
                                   </li>
                                   <li>
                                       <div className={"name"}>직원 수</div>
                                       <div className={"type"}>(Int)</div>
                                   </li>
                               </ul>
                           </li>
                       </ul>

                   </div>
                   <div className={"originDataType"}>
                       <div className={"wrapper_title"}>원본 데이터 타입</div>
                       <ul className={"datatype_list"}>
                           <li>
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
                       <ul className={"datatype_list"}>
                           <li>
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
                   <div className={"TaskParticipate"}>
                       <div className={"wrapper_title"}>
                           <Link to ="/submit/taskcheck" className="link-task-participate"><button className="task-participate">참여 신청하기</button></Link>
                       </div>

                   </div>
               </div>


           </div>
       </div>
   );
}
