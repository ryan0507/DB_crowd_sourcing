import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

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


function Admin_taskAdd(){
    const classes = useStyles();
    const [minUpload, setMinUpload] = React.useState<string | number>('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMinUpload(event.target.value as number);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
   return(
       <div className="submit_submitFile">
           <div className="wrapper">
               <div className="Title">(태스크 이름) 제출하기</div>
               <Link to = "/submit/taskinfo2" className="right_side_small">뒤로가기</Link>
               <div className="formContent">
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
                               <div className={"datatypeID"}>ID : 002</div>
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
                               <div className={"datatypeID"}>ID : 002</div>
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

                   <div className={"minUpload"}>
                       <div className={"wrapper_title"}>원본 데이터 타입 선택</div>
                       <div className={"dropdown"}>
                          <FormControl className={classes.formControl}>
                            <Select
                              labelId="demo-controlled-open-select-label"
                              id="demo-controlled-open-select"
                              open={open}
                              onClose={handleClose}
                              onOpen={handleOpen}
                              value={minUpload}
                              onChange={handleChange}
                              style={{textAlign:'center'}}
                            >
                                <MenuItem value={'001'}>ID:001</MenuItem>
                                <MenuItem value={'002'}>ID:002</MenuItem>
                            </Select>
                          </FormControl>
                       </div>
                   </div>
                   <div className={"dataTable_name"}>
                       <span className={"wrapper_title"}  >회차: 3회차</span>
                   </div>

                   <div className={"dataTable_name"}>
                       <div className={"wrapper_title"}>데이터 수집날짜(시작일, 종료일)</div>
                       <input type="date" className="select__birth" ></input>
                       <input type="date" className="select__birth"></input>
                   </div>



                   <div className={"dataTableSchema"}>
                       <div className={"wrapper_title"}>제출 파일</div>
                       <form>
                           <input type = "file"/>
                       </form>
                   </div>
                   <div className={"TaskParticipate"}>
                       <div className={"wrapper_title"}>
                           <Link to ="/submit/taskinfo2" className="link-task-participate"><button className="task-participate">파일 제출하기</button></Link>
                       </div>
                   </div>
               </div>
           </div>
       </div>

   );
}

export default Admin_taskAdd;