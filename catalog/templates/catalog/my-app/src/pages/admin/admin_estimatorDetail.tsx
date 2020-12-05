import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
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

interface assesor {
    ID : string,
    Files : file[],
    Total : number,
    Check : number,
    Pass : number,
}

interface file {
    TaskName : string,
    SubmitterName : string,
    OriginSchema : string,
    Filename: string,
    QualAssessment: string,
    P_NP : string,
}



interface Column {
  id:  'taskname'| 'presenter' | 'OriginSchema' | 'fileName' | 'presenterScore' | 'pNp';
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'taskname', label: '태스크\u00a0이름'},

    {id: 'presenter', label: '제출자'},
    {id : "OriginSchema", label : '원본 데이터 타입'},
  {
    id: 'fileName',
    label: '평가\u00a0파일명',
  },
    {id: 'presenterScore', label: '평가한\u00a0점수'},
  {
    id: 'pNp',
    label: 'Pass\u00a0여부',
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
    taskname: string,
  presenter: string,
    OriginSchema: string,
  fileName: string;
  presenterScore: string,
  pNp: string;
}

// function createData( taskname: string, estimatedate: string, estimatetime: string, presenter: string, fileName: string, presenterScore:string, pNp: string): Data {
//   return { taskname, estimatedate, estimatetime, presenter, fileName, presenterScore, pNp };
// }

function createData(files : file[]): Data[] {
    let temp : Data[] = [];
    files.map((item)=>{
        temp.push({taskname : item.TaskName, presenter: item.SubmitterName, OriginSchema:item.OriginSchema, fileName: item.Filename, presenterScore: item.QualAssessment, pNp: item.P_NP,})
    })
  return temp;
}

export default function Admin_presenterDetail(props : RouteComponentProps<{as_ID : string}>,){
    const [assesor, setAssesor] = useState<assesor>({ID : "", Files : [], Total: 0, Check: 0, Pass: 0,});
    const getApi = async() =>{
        await axios.get(`http://127.0.0.1:8000/adminUI/user/assessor/${props.match.params.as_ID}`).then((r)=>{
            let temp: assesor = r.data;
            setAssesor(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

    const rows = createData(assesor.Files);

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
       <div className={"estimatorDetail"}>
       <div className="wrapper">
           <div className="Title">{assesor.ID}</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"taskStatistic"}>
                       <div className={"submitFiles"}>할당된 파일 수 : {assesor.Total}개   , 평가한 파일 수 : {assesor.Check}개</div>
                       <div className={"passFiles"}>Pass한 파일 수 : {assesor.Pass}개</div>
                       <Paper className={classes.root} style={{display: 'inline-block'}}>
                          <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  {columns.map((column) => (
                                    <TableCell
                                      key={column.id}
                                      align={'center'}
                                      style={{ minWidth: column.minWidth,  fontSize: '16px', fontWeight: 'bold',  }}
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
                                        }else if (column.id === "pNp" && value =="W") {
                                            return(
                                                <TableCell key={column.id} align='center'
                                                           style={{fontSize: '14px', fontWeight: 'normal' }}>
                                                    평가 전
                                                </TableCell>
                                            );
                                        }
                                        else{
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
