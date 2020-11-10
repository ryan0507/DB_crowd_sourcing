import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_taskAdd(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 추가</div>
           <Link to = "./admin_main" className="right_side_small">뒤로가기</Link>
           <div className="formContent"> 내용 </div>
       </div>
   );
}

export default admin_taskAdd;