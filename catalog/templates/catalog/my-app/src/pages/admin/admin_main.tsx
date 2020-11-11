import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_main(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 목록</div>
           <Link to = "/admin/taskadd" className = "right_side_small">태스크 추가하기</Link>
           <Link to = "/admin/taskinfo"><div className="content_list"> 내용 </div></Link>
       </div>
   );
}

export default admin_main;