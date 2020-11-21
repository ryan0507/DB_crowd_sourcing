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

export default function Submit_taskCheck(){
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
           <div className="Title">개인정보 이용동의서</div>
           <Link to = "/submit/taskinfo" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"task_name"}>
                   <div className={"wrapper_title"}>개인정보 이용동의서</div>
                   <div className={"lightgray_wrapper"}>
                       <p>본인은 귀사에 이력서를 제출함에 따라 [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를 수집, 이용 및 제공하는데 동의합니다.</p>
                       <p>□ 개인정보의 수집 및 이용에 관한 사항 </p>
                       <p> - 수집하는 개인정보 항목 : 성명, 주소, 생년월일, 휴대전화 등 기본 정보</p>
                       <p> - 개인정보의 이용 목적 : 데이터의 품질 관리 및 회원관리을 위해서 활용하며, 목적 외에 용도로는 사용하지 않습니다.</p>
                       <p>□ 개인정보의 보관 및 이용 기간</p>
                       <p>- 귀하의 개인정보를 다음과 같이 보관하며, 수집, 이용 및 제공목적이 달성된 경우 [개인정보 보호법] 제21조에 따라 처리합니다.</p>
                   </div>
               </div>

               <div className={"TaskParticipate"}>
                   <div className={"wrapper_title"}>
                       <Link to ="/submit/main" className="link-task-participate"><button className="task-participate">본인은 개인정보 수집 및 이용에 대하여 동의합니다.</button></Link>
                   </div>

               </div>
           </div>


       </div>
   );
}
