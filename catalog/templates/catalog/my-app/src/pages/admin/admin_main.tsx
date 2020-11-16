import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_main(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 목록</div>
           <Link to = "/admin/taskadd" className = "right_side_small">태스크 추가하기</Link>
           <ul className={"task_list"}>
               <li>
                   <Link to = "/admin/taskinfo">
                       <div className="content_list">
                           <div className={"taskName"}>태스크 이름</div>
                           <div className={"applicant"}>새로운 신청자 1명</div>
                           <div className={"aboutTask"}>태스크 설명~~~~~</div>
                       </div>
                    </Link>
               </li>
           </ul>
       </div>
   );
}

export default admin_main;