import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function submit_main(){
   return(
       <div className="submit_main">
           <div className="wrapper">
           <div className="Title">태스크 목록</div>
           <ul className={"task_list"}>
               <li>
                   <Link to = "/submit/taskinfo">
                       <div className="content_list">
                           <div className={"taskName"}>태스크 이름</div>
                           <div className={"applicant"}>참여 신청 완료</div>
                           <div className={"aboutTask"}>태스크 설명~~~~~</div>
                       </div>
                    </Link>
               </li>
           </ul>
       </div>
       </div>
   );
}

export default submit_main;