import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface Task{
    TaskID: string;
    Name : string;
    Description: string;
    Count : number;
}
const Admin_main = (props : RouteComponentProps<{}>,)=>{
    const[task, setTask] = useState<Task[]>([]);
    const getApi = async() =>{
        await axios.get('http://165.132.105.46:3025/adminUI/').then((r)=>{
            let temp: Task[] = r.data;
            setTask(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

   return(
       <div className="wrapper">
           <div className="Title">태스크 목록</div>
           <Link to = "/admin/taskadd" className = "right_side_small">태스크 추가하기</Link>
           {task.map((item)=>{
               return(
                   <ul className={"task_list"}>
                       <li>
                           <Link to = {`/admin/taskinfo/${item.TaskID}`}>
                               <div className="content_list">
                                   <div className={"taskName"}>{item.Name}</div>
                                   <div className={"applicant"}>새로운 신청자 {item.Count}명</div>
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

export default Admin_main;