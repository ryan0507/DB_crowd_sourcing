import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_taskInfo(){
   return(
       <div className="wrapper">
           <div className="Title">TITLE</div>
           <div className="right_side_small">뒤로가기</div>
           <div className="formContent"> 내용 </div>
       </div>
   );
}

export default admin_taskInfo;