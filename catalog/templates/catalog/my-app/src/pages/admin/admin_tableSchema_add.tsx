import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_tableSchema_add(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 데이터 테이블 스키마</div>
           <Link to = "/admin/taskadd" className="right_side_small">뒤로가기</Link>
           <div className="formContent"> 내용 </div>
       </div>
   );
}

export default admin_tableSchema_add;