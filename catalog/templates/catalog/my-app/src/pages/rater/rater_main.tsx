import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function rater_main(){
   return(
       <div className="wrapper">
           <div className="Title">할당된 파일 목록</div>
           <ul className={"task_list"}>
               <li>
                   <Link to = "/rater/fileDetail">
                       <div className="content_list">
                           <div className={"taskName"}>태스크 이름</div>
                           <div className={"startDate"}>할당된 날짜</div>
                           <div className={"fileName"}>할당된 파일 제목.csv</div>
                       </div>
                    </Link>
               </li>
           </ul>
       </div>
   );
}

export default rater_main;