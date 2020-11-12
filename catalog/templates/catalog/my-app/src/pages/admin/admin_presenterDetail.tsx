import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import table from '../table';

function admin_presenterDetail(){
   return(
       <div className="wrapper">
           <div className="Title">presenter ID</div>
           <Link to = "/admin/userlist" className="right_side_small">뒤로가기</Link>
           <div className="formContent"> {table()} </div>

       </div>
   );
}

export default admin_presenterDetail;