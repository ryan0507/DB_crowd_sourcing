import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true

interface MainData{
    SubmissionID: number;
    TaskName : string;
    FileName: string;
    SubmissionDate : string;
}

const Rater_main = (props : RouteComponentProps<{}>,)=>{
    const[task, setTask] = useState<MainData[]>([]);
    const getApi = async() =>{
        await axios.get('http://165.132.105.46:3025/raterUI/').then((r)=>{
            let temp: MainData[] = r.data;
            setTask(temp);
            console.log(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

   return(
       <div className="wrapper">
           <div className="Title">할당된 파일 목록</div>
           {task.map((item)=> {
               return(
                   <ul className={"task_list"}>
                       <li>
                           <Link to={`/rater/fileDetail/${item.SubmissionID}`}>
                               <div className="content_list">
                                   <div className={"taskName"}>{item.TaskName}</div>
                                   <div className={"startDate"}>{item.SubmissionDate}</div>
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

export default Rater_main;