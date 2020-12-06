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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface fileDetail{
    FileName : string,
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
    const [detail, setDetail] = useState<fileDetail>({FileName: '', Columns: [], Submissions: []});
    const [isLoaing, setIsLoading] = useState<boolean>(true);
    const getApi = async() =>{
        await axios.get(`http://165.132.105.46:3025/adminUI/${props.match.params.task_id}/${props.match.params.submission_id}`).then((r)=>{
            let temp: fileDetail = r.data;
            setDetail(temp);
            setIsLoading(false);
        })
    }

    useEffect(()=>{
        getApi()
    },[])
    const classes = useStyles();
    const downloadfile = (i:string, name:string) => {
        axios({method: 'GET', url: `http://165.132.105.46:3025/adminUI/downloadcsv/${i}`,
        responseType: 'blob' }).then((r)=>{
            if (r.status === 200) {
                const url = window.URL.createObjectURL(new Blob([r.data], { type: r.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',  name + ".csv");
                document.body.appendChild(link);
                link.click();
                alert('파일이 다운로드 됩니다.')
            }else if (r.status === 201) {
                alert('NonPass를 받은 파일은 삭제됩니다')
            }else {
                alert('오류가 발생했습니다.')
            }
        })
    }
   return(
       <div className={"fileDetail"}>
       <div className="wrapper">
           {isLoaing ? (
               // <div></div>
               <div className={"Loading"}>해당 파일을 로딩하는 중입니다.<br/>잠시만 기다려주세요.<br/><FontAwesomeIcon icon="spinner" spin/></div>
           ) : (<div>
               <div className="Title">{detail.FileName}</div>
               <Link to ={`/admin/taskinfo/${props.match.params.task_id}`} className="right_side_small">뒤로가기</Link>
               <div className={"downloadCSV"}>
                   <button onClick = {(i) => downloadfile(props.match.params.task_id,detail.FileName)}>
                        해당 파일 다운
                    </button>
               </div>
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
                </Paper></div>
           )}

        </div>
       </div>
   );
}