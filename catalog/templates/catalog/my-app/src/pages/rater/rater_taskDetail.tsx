import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import axios from "axios";
import React, {useEffect, useState} from 'react';
import {render} from "react-dom";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface taskDetail{
    SubmissionID: number,
    TaskDescription: string,
    TaskThreshold: number,
    StartDate: Date,
    EndDate: Date,
    TableName: string,
    TaskSchema: string,
    OriginSchema: string,
    QualAssessment: number,
    P_NP: string,
    TaskName : string,
    SubmissionNumber : number,
    OriginSchemaMapping : string,
    OriginTypeID : number
}


interface Data {
  name: string;
  date: string;
  time: string;
  fileName: string;
  pNp: string;
  score: string;
}


export default function Rater_taskDetail(props : RouteComponentProps<{submission_id : string}>,){
    const[task, setTask] = useState<taskDetail[]>([]);

    const getApi = async() =>{
       await axios.get(`http://127.0.0.1:8000/raterUI/taskDetail/${props.match.params.submission_id}/`).then((r)=>{
            let temp: taskDetail[] = r.data;
            setTask(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])


   return(
       <div className="rater_taskDetail">
       <div className="wrapper">
           {task.map((item)=> {
               const isPass = item.P_NP === "P";

               const originSchemaArr = item.OriginSchemaMapping.split("%");
               const taskSchemaArr = item.TaskSchema.split("%");

               const final_originSchemaArr = [];
               const final_taskSchemaArr = [];

               for (var i = 0; i<originSchemaArr.length/2; i++){
                   const new_key = originSchemaArr[2*i];
                   const new_val = originSchemaArr[2*i+1];
                   final_originSchemaArr.push([new_key, new_val])
               }

               for (var i = 0; i<taskSchemaArr.length/2; i++){
                   const task_new_key = taskSchemaArr[2*i];
                   const task_new_val = taskSchemaArr[2*i+1];
                   final_taskSchemaArr.push([task_new_key, task_new_val])
               }

               const originSchemaList = final_originSchemaArr.map((new_item) => {
                     return (
                           <li>
                               <div className={"name"}>{new_item[0]}</div>
                               <div className={"type"}>{new_item[1]}</div>
                           </li>
                        );
                      });

               const taskSchemaList = final_taskSchemaArr.map((new_item) => {
                     return (
                           <li>
                               <div className={"name"}>{new_item[0]}</div>
                               <div className={"type"}>{new_item[1]}</div>
                           </li>
                        );
                      });

               return(
                   <React.Fragment>
                   <div className="Title">{item.TaskName}</div>
                       <Link to = "/rater/main2" className="right_side_small">뒤로가기</Link>
                       <div className="formContent">
                           <div className={"task_info"}>
                               <div className={"wrapper_title"}>태스크 설명</div>
                               <div className={"lightgray_wrapper"}>{item.TaskDescription}</div>
                           </div>
                           <div className={"task_howToPass"}>
                               <div className={"wrapper_title"}>태스크 PASS 기준</div>
                               <div className={"lightgray_wrapper"}>{item.TaskThreshold}</div>
                           </div>
                           <div className={"task_num"}>
                               <div className={"wrapper_title"}>회차</div>
                               <div className={"lightgray_wrapper"}>{item.SubmissionNumber}회</div>
                           </div>
                           <div className={"task_duration"}>
                               <div className={"wrapper_title"}>기간</div>
                               <div className={"lightgray_wrapper"}>{item.StartDate} ~ {item.EndDate}</div>
                           </div>
                           <div className={"file_download"}>
                               <div className={"wrapper_title"}>파일 다운로드</div>
                               <div className={"lightgray_wrapper_file"}>새마을식당.csv</div>
                           </div>
                           <div className={"taskData_table_name"}>
                               <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                               <div className={"lightgray_wrapper"}>{item.TableName}</div>
                           </div>
                           <div className={"dataTableSchema"}>
                               <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                               <ul className={"datatype_list"}>
                                   <ul className={"value_list"}>
                                       {taskSchemaList}
                                   </ul>
                               </ul>

                           </div>
                           <div className={"originDataType"}>
                               <div className={"wrapper_title"}>선택된 원본 데이터 타입 - ID : {item.OriginTypeID}, OriginSchema : {item.OriginSchema}</div>
                               <ul className={"datatype_list"}>
                                   <ul className={"value_list"}>
                                       {originSchemaList}
                                   </ul>
                               </ul>

                           </div>
                           <div className={"score"}>
                               <div className={"wrapper_title"}>점수</div>
                               <div className={"lightgray_wrapper"}>{item.QualAssessment}</div>
                           </div>
                           <div className={"passed"}>
                               <div className={"wrapper_title"}>[평가자] P/NP</div>
                               <div className={"lightgray_wrapper"}>{isPass ? "PASS" : "NONPASS"}</div>
                           </div>
                       </div>
                       </React.Fragment>
           )
           })}
       </div>
       </div>
   );
}
