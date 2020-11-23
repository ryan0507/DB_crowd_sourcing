import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },

  }),
);

interface Task{
    TaskID : string;
    SubmissionPeriod : string;
    TableName : string;
    TaskSchema : string;
    Name : string;
    Description : string;
}


function Admin_taskAdd(){
    const initialTask = {
        TaskID : "",
        SubmissionPeriod : "",
        TableName : "",
        TaskSchema : "",
        Name : "",
        Description :"",
    }
    const [task, setTask] = useState<Task>(initialTask);
    const classes = useStyles();
    const [minUpload, setMinUpload] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);

    // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setMinUpload(event.target.value as number);
    //
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleInputChange =<P extends keyof Task> (item : P, value: Task[P]) =>{
        setTask({...task, [item] : value});
    }
    const handleSubmit = ( event : React.FormEvent<HTMLFormElement> ) =>{
        event.preventDefault();
        axios.post('http://127.0.0.1:8000/adminUI/create/', {
            TaskID : task.TaskID,
            SubmissionPeriod : 0,
            TableName : task.TableName,
            TaskSchema : task.TaskSchema,
            Name : task.Name,
            Description :task.Description,
        }).then(res => {
        console.log(res);
        console.log(res.data);
        console.log('hhhhhhhhhhhhhhhh');
      }).catch((error) => console.log( error.response.request._response ) );;
        // const taskName = {event.target.name}
        // setTask({e.target.name.task_name, 0, '', '', '', ''}) ;
        // {_TaskID: {e.target.elements.task_name},
        // _SubmissionPeriod : {e.target}
        // _TableName ,
        // _TaskSchema,
        // _Name,
        // _Description};
    };

   return(
       <div className={"taskAdd"}>
       <div className="wrapper">
           <div className="Title">태스크 추가</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <form onSubmit={(event) => handleSubmit(event)}>
               <div className={"task_name"}>
                   <div className={"wrapper_title"}>태스크 이름</div>
                       <InputBase
                           name={"taskID"}
                            className={"nameTask"}
                            placeholder="태스크 이름을 작성해주세요."
                            inputProps={{ 'aria-label': '태스크 이름' }}
                           onChange={e=> handleInputChange('TaskID', e.target.value)}
                          />
               </div>

               <div className={"task_info"}>
                   <div className={"wrapper_title"}>태스크 설명</div>
                       <InputBase
                            className={"aboutTask"}
                            placeholder="태스크에 관한 설명을 작성해주세요."
                            inputProps={{ 'aria-label': '태스크 설명' }}
                           onChange={e=> handleInputChange('Description', e.target.value)}
                          />
               </div>

               <div className={"task_howToPass"}>
                   <div className={"wrapper_title"}>태스크 PASS 기준</div>
                   <InputBase
                          className={"howToTask"}
                        placeholder="태스크의 파일 제출 통과 기준을 작성해주세요."
                        inputProps={{ 'aria-label': '통과 기준 설명' }}
                          />
               </div>

               <div className={"minUpload"}>
                   <div className={"wrapper_title"}>최소 업로드 주기</div>
                   <div className={"dropdown"}>
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={open}
                          onClose={handleClose}
                          onOpen={handleOpen}
                          value={task.SubmissionPeriod}
                          onChange={e=> handleInputChange('SubmissionPeriod', (e.target.value as string))}
                          style={{textAlign:'center'}}
                        >
                          <MenuItem value="">
                            <em>선택 안 함</em>
                          </MenuItem>
                          <MenuItem value={"10"}>10일</MenuItem>
                          <MenuItem value={"20"}>20일</MenuItem>
                          <MenuItem value={"30"}>30일</MenuItem>
                          <MenuItem value={"40"}>40일</MenuItem>
                          <MenuItem value={"50"}>50일</MenuItem>
                          <MenuItem value={"60"}>60일</MenuItem>
                          <MenuItem value={"70"}>70일</MenuItem>
                          <MenuItem value={"80"}>80일</MenuItem>
                          <MenuItem value={"90"}>90일</MenuItem>
                          <MenuItem value={"100"}>100일</MenuItem>
                        </Select>
                      </FormControl>
                   </div>
               </div>

               <div className={"dataTable_name"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                       <InputBase
                          className={"nameDataTable"}
                        placeholder="태스크 데이터 테이블의 이름을 작성해주세요."
                        inputProps={{ 'aria-label': '데이터 테이블 이름' }}
                          />
               </div>

               <div className={"dataTableSchema"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                   <Link className={"addDataType"} to = "/admin/tableschemaadd">태스크 데이터 테이블 스키마 수정하기</Link>
                   <ul className={"dataTableSchema_list"}>
                       <li>음식점 이름</li>
                       <li>월 매출</li>
                       <li>월 고객 수</li>
                       <li>월 순이익</li>
                       <li>직원 수</li>
                   </ul>
               </div>

               <div className={"originDataType_add"}>
                   <div className={"wrapper_title"}>원본 데이터 타입</div>
                   <Link className={"addDataType"} to = "/admin/datatypeadd">원본 데이터 타입 추가하기</Link>
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
               <input type="submit" value="제출"/>
               </form>
           </div>
       </div>
       </div>
   );
}

export default Admin_taskAdd;