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
    QuanAssessment : number,
    FileName: string
}


export default function Rater_taskDetail(props : RouteComponentProps<{submission_id : string}>,){
    const[task, setTask] = useState<taskDetail[]>([]);

    const getApi = async() =>{
       await axios.get(`http://165.132.105.46:3025/raterUI/taskDetail/${props.match.params.submission_id}/`).then((r)=>{
            let temp: taskDetail[] = r.data;
            setTask(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

    const downloadfile = (i:string, name:string) => {
        axios({method: 'GET', url: `http://165.132.105.46:3025/submitUI/downloadcsvfile/${i}/`,
            responseType: 'blob' }).then((r)=>{
            if (r.status === 200) {
                const url = window.URL.createObjectURL(new Blob([r.data], { type: r.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',  name);
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
                                   <button className={"downloadCSV"} onClick = {(i) => downloadfile(props.match.params.submission_id, item.FileName)}>
                                       {item.FileName}
                                   </button>
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
                               <div className={"wrapper_title"}>선택된 원본 데이터 타입 - ID : {item.OriginTypeID}[{item.OriginSchema}]</div>
                               <ul className={"datatype_list"}>
                                   <ul className={"value_list"}>
                                       {originSchemaList}
                                   </ul>
                               </ul>

                           </div>
                           <div className={"quanScore"}>
                               <div className={"wrapper_title"}>정량평가 점수</div>
                               <div className={"lightgray_wrapper"}>{item.QuanAssessment}점</div>
                           </div>
                           <div className={"score"}>
                               <div className={"wrapper_title"}>정성평가 점수</div>
                               <div className={"lightgray_wrapper"}>{item.QualAssessment}점</div>
                           </div>
                           <div className={"passed"}>
                               <div className={"wrapper_title"}>P/NP</div>
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
