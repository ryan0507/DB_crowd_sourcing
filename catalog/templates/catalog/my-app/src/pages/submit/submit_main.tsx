import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

interface Task{
    TaskID: string;
    Name : string;
    Description: string;
    Participate : string;
}

const Submit_main = ()=>{
    const[task, setTask] = useState<Task[]>([]);
    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/submitUI/main1task').then((r)=>{
            let temp: Task[] = r.data;
            setTask(temp);
        })
    }
    // getApi();
    // getApi2();
    //
    useEffect(()=>{
        getApi()
    },[])


   return(
       <div className="wrapper">
           <div className="Title">태스크 목록</div>
           {task.map((item)=>{
               return(
                   <ul className={"task_list"}>
                       <li>
                           <Link to = {`/submit/taskinfo/${item.TaskID}`}>
                               <div className="content_list">
                                   <div className={"taskName"}>{item.Name}</div>
                                   <div className={"applicant"}>{item.Participate}</div>
                                   <div className={"aboutTask"}>{item.Description}</div>
                               </div>
                            </Link>
                       </li>
                   </ul>
               )
           })}

       </div>
   );
}

export default Submit_main;
