import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function rater_main2(){
   return(
       <div className="wrapper">
           <div className="Title">평가 내역</div>
           <ul className={"task_list"}>
               <li>
                   <Link to = "/rater/taskDetail">
                       <div className="content_list">
                           <div className={"taskName"}>태스크 이름</div>
                           <div className={"doneDate"}>평가한 날짜</div>
                           <div className={"fileName"}>평가한 파일 이름.csv</div>
                       </div>
                    </Link>
               </li>
           </ul>
       </div>
   );
}

export default rater_main2;