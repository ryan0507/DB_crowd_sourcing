import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_datatype_add(){
   return(
       <div className="wrapper">
           <div className="Title">원본 데이터 타입 추가</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent"> 내용 </div>
       </div>
   );
}

export default admin_datatype_add;