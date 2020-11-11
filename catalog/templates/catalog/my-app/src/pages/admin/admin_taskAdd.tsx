import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_taskAdd(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 추가</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div>내용</div>
               <Link to = "/admin/tableschemaadd">태스크 데이터 테이블 스키마 수정하기</Link>
               <Link to = "/admin/datatypeadd">원본 데이터 타입 추가하기</Link>
           </div>
       </div>
   );
}

export default admin_taskAdd;