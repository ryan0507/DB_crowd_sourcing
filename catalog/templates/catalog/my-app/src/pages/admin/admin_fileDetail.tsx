import {BrowserRouter as Router, Route, Link, RouteComponentProps} from 'react-router-dom';
import React, {useEffect} from 'react';
import table from '../table';
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import axios from "axios";

interface Column {
  id: 'name' | 'salary' | 'customer' | 'money' ;
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: '음식점\u00a0이름'},
  { id: 'salary', label: '월\u00a0매출' },
  { id: 'customer',label: '월\u00a0고객\u00a0수'},
  {id: 'money',label: '순\u00a0이익',},
];

const useStyles = makeStyles({
  root: {
    width: '1000px',
      marginTop: '100px',
  },
  container: {
    maxHeight: 440,
  }
});


interface Data {
  name: string;
  salary: number;
  customer: number;
  money: number;
}

function createData( name: string, salary: number, customer: number,money: number): Data {
  return { name, salary, customer, money };
}

const rows = [
  createData('새마을식당', 30000000,  60000, 4500000),
  createData('새마을식당', 30000000,  60000, 4500000),
];

export default function Admin_fileDetail(props : RouteComponentProps<{submission_id : string}>,){
    // const getApi = async() =>{
    //     await axios.get(`http://127.0.0.1:8000/adminUI/${props.match.params.task_id}/`).then((r)=>{
    //         let temp: taskInfo = r.data;
    //         setInfo(temp);
    //     })
    // }
    //
    // useEffect(()=>{
    //     getApi()
    // },[])
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
           <div className="Title">file name</div>
           <Link to = "/admin/taskinfo" className="right_side_small">뒤로가기</Link>
           <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={'center'}
                          style={{ minWidth: column.minWidth, fontSize: '16px', fontWeight: 'bold' }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                          {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                  <TableCell key={column.id} align='center'
                                  style={{fontSize: '14px', fontWeight: 'normal' }}>
                                      {column.format && typeof value === 'number' ? column.format(value) : value}
                                  </TableCell>
                                );
                            }
                          )}
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
   );
}
