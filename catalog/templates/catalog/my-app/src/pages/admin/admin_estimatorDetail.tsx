import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import table from '../table';

function admin_estimatorDetail(){
   return(
       <div className="wrapper">
           <div className="Title">estimator ID</div>
           <Link to = "/admin/userlist" className="right_side_small">뒤로가기</Link>
           <div className="formContent"> {table()} </div>

       </div>
   );
}

export default admin_estimatorDetail;