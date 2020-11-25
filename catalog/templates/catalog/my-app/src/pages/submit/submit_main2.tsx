import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function submit_main2(){
   return(
       <div className="submit_main2">
           <div className={"wrapper"}>
               <div className="Title">참여중인 태스크</div>
               <Link to = "/submit/main" className="right_side_small">현재 나의 평가 점수: 10점</Link>
               <ul className={"task_list"}>
                   <li>
                       <Link to = "/submit/taskinfo2">
                           <div className="content_list">
                               <div className={"taskName"}>태스크 이름</div>
                               <div className={"applicant"}>제출파일(Pass파일): 0개(0개)</div>
                               <div className={"aboutTask"}>태스크 설명~~~~~</div>
                               <div className={"applicant"}>평균 평가 점수: 10점</div>
                           </div>
                        </Link>
                   </li>
               </ul>
           </div>
       </div>
   );
}

export default submit_main2;