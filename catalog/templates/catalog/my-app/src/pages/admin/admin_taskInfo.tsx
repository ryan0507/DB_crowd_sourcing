import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_taskInfo(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 이름</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div>내용</div>
               <Link to = "/admin/datatypeadd">원본 데이터 타입 추가하기</Link>
               <div className = "task_statistics">
                   <Link to = "/admin/table">새마을식당_10월.csv</Link>
               </div>
           </div>
       </div>
   );
}

export default admin_taskInfo;