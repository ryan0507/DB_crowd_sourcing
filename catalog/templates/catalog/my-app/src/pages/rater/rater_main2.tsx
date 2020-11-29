import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface Main2Data{
    SubmissionID: number;
    TaskName : string;
    FileName: string;
    PassNonpass : string;
}

const Rater_main2 = (props : RouteComponentProps<{}>,)=>{
    const[task, setTask] = useState<Main2Data[]>([]);
    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/raterUI/main2').then((r)=>{
            let temp: Main2Data[] = r.data;
            setTask(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

    return(
       <div className="wrapper">
           <div className="Title">평가 내역</div>
           {task.map((item)=> {
               const isPass = item.PassNonpass === "P";
               return(
                   <ul className={"task_list"}>
                       <li>
                           <Link to = {`/rater/taskDetail/${item.SubmissionID}`}>
                               <div className="content_list">
                                   <div className={"taskName"}>{item.TaskName}</div>
                                   <div className={"doneDate"}>{isPass ? "PASS" : "NONPASS"}</div>
                                   <div className={"fileName"}>{item.FileName}</div>
                               </div>
                            </Link>
                       </li>
                   </ul>
               )
           })}
       </div>
   );
}

export default Rater_main2;