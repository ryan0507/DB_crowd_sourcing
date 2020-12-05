import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, { Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface submitter {
    Tasks : task[],
    ID : string,
    score : string,
}
interface task{
    TaskName : string,
    Files: file[],
    Total : number,
    Pass : number,
}
interface file{
    SubmissionNum : string,
    SubmissionDate : string,
    OriginSchema : string,
    FileName : string,
    QualAssessment : string,
    QuanAssessment : string,
    P_NP : string,
    SubmissionTime : string,
}

interface Column {
  id: 'SubmissionNum' | 'SubmissionDate'| 'OriginSchema' | 'FileName' | 'QualAssessment' | 'QuanAssessment' | 'P_NP';
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
    {id : "OriginSchema", label: '원본 데이터 타입'},
    {id : "SubmissionNum", label : '회차'},
  { id: 'SubmissionDate', label: '제출일', minWidth: 80 },
  {
    id: 'FileName',
    label: '제출\u00a0파일명',
    minWidth: 140,
  },
    {id : 'QualAssessment', label: '정성 점수'},
    {id : 'QuanAssessment', label: '정량 점수'},
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


interface Data {
    SubmissionDate : string,
    FileName : string,
    P_NP : string,
}

// function createData(  date: string, time: string,fileName: string, pNp: string): Data {
//   return { date, time, fileName, pNp };
// }
// function createData(_file : file[]): file[] {
//     let temp : file[] = [];
//
//     _file.map((item)=>{
//
//         let tempJoined : string[] = [];
//         if(item.Task != []){
//         item.Task?.map((joined)=>{
//             if(joined != null) {tempJoined.push(joined+", ")}
//             else {tempJoined.push('-')}
//         })}
//         temp.push({ID : item.ID, name: item.Name, birth: item.DateOfBirth, ages: item.age+"대", sex: item.Gender, role:item.role, joined: tempJoined, phoneNum: item.PhoneNumber,})
//     })
//   return temp;
// }

// const rows = [
//   createData('20.11.01', '23 : 15 : 20', '음악은_즐거워.csv', 'Non-pass'),
//   createData( '20.11.02', '23 : 15 : 30', '새마을식당_10월.csv', 'Pass'),
// ];

export default function Admin_presenterDetail(props : RouteComponentProps<{su_ID : string}>,){
    const [submitter, setSubmitter] = useState<submitter>({Tasks: [], ID : '', score: '',});
    const getApi = async() =>{
        await axios.get(`http://127.0.0.1:8000/adminUI/user/submitter/${props.match.params.su_ID}`).then((r)=>{
            let temp: submitter = r.data;
            setSubmitter(temp);
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
       <div className={"presenterDetail"}>
       <div className="wrapper">
           <div className="Title">{submitter.ID} ({submitter.score}점)</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               {submitter.Tasks.map((item)=>{
                   let rows = item.Files;
                   return(
                     <div className={"taskStatistic"}>
                       <div className={"wrapper_title"}>{item.TaskName}</div>
                       <div className={"lightgray_wrapper"}>
                           <div className={"submitFiles"}>제출한 파일 수 : {item.Total}개</div>
                           <div className={"passFiles"}>Pass된 파일 수 : {item.Pass}개</div>
                           <Paper className={classes.root} style={{display: 'inline-block'}}>
                              <TableContainer className={classes.container}>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      {columns.map((column) => (
                                        <TableCell
                                          key={column.id}
                                          align={'center'}
                                          style={{ minWidth: column.minWidth, backgroundColor: 'white', fontSize: '16px', fontWeight: 'bold',  }}
                                        >
                                          {column.label}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                      return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.FileName}>
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
                                            }else if(column.id == "P_NP" && value =="W"){
                                                return(
                                                    <TableCell key={column.id} align='center'
                                                          style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                            평가 전
                                                      </TableCell>
                                                )
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
                   </div> );
               })}

           </div>
       </div>
       </div>
   );
}
