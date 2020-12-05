import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';

import React, { Fragment, useEffect, useState} from 'react';
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


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface fileDetail{
    Columns : string[],
    Submissions : _submission[],
}
interface _submission{
    submission: string[],
}


const useStyles = makeStyles({
  root: {
    width: '1000px',
      marginTop: '100px',
  },
  container: {
    maxHeight: 440,
  }
});

export default function Admin_fileDetail(props : RouteComponentProps<{task_id : string, submission_id : string}>,){
    const [detail, setDetail] = useState<fileDetail>({Columns: [], Submissions: []});
    const getApi = async() =>{
        await axios.get(`http://127.0.0.1:8000/adminUI/${props.match.params.task_id}/${props.match.params.submission_id}`).then((r)=>{
            let temp: fileDetail = r.data;
            setDetail(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])
    interface submission{
    }
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
                        {detail.Columns.map((item)=>{
                            if(item!= "SubmissionID") {
                                return (<TableCell align="center" style={{fontSize: '16px', fontWeight: 'bold'}}>{item}</TableCell>);
                            }})}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detail.Submissions.map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          {row.submission.slice(1).map((column) => {
                              return (
                                  <TableCell align='center' style={{fontSize: '14px', fontWeight: 'normal' }}>
                                      {column}
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
                count={detail.Submissions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>

       </div>
   );
}
