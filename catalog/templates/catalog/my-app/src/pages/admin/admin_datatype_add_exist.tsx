import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import table from '../table';

function admin_datatype_add_exist(){
   return(
       <div className="wrapper">
           <div className="Title">원본 데이터 타입 추가</div>
           <Link to = "/admin/taskInfo" className="right_side_small">뒤로가기</Link>
           <div className="formContent"> {table()} </div>

       </div>
   );
}

export default admin_datatype_add_exist;