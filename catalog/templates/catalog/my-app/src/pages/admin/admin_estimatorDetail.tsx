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

interface Column {
  id:  'taskname'| 'estimatedate' | 'estimatetime' | 'presenter' | 'fileName' | 'presenterScore' | 'pNp';
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'taskname', label: '태스크\u00a0이름'},
  { id: 'estimatedate', label: '제출일', minWidth: 80 },
  {
    id: 'estimatetime',
    label: '제출시간',
  },
    {id: 'presenter', label: '제출자'},
  {
    id: 'fileName',
    label: '평가\u00a0파일명',
  },
    {id: 'presenterScore', label: '제출자\u00a0점수'},
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
  estimatedate: string;
  estimatetime: string;
  presenter: string,
  fileName: string;
  presenterScore: string,
  pNp: string;
}

function createData( taskname: string, estimatedate: string, estimatetime: string, presenter: string, fileName: string, presenterScore:string, pNp: string): Data {
  return { taskname, estimatedate, estimatetime, presenter, fileName, presenterScore, pNp };
}

const rows = [
  createData('음식점','20.11.02', '23 : 15 : 20','박선종', '음악은_즐거워.csv', '4점', 'Non-pass'),
  createData('음식점','20.11.02', '23 : 15 : 20','박선종', '음악은_즐거워.csv', '4점', 'Non-pass'),
];

export default function Admin_presenterDetail(){
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
           <div className="Title">평가자 ID</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"taskStatistic"}>
                       <div className={"submitFiles"}>제출한 파일 수 : {rows.length}개</div>
                       <div className={"passFiles"}>Pass된 파일 수 : 0개</div>
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.estimatetime}>
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
