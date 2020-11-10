import React from 'react';

function admin_taskInfo(){
   return(
       <div className="App">
           <body>
               <div className="fixed-header">
                   <div className="container">
                       <nav>
                           <a className="n" href="#">태스크 관리</a>
                           <a className="nr" href="#">비밀번호 변경</a>
                           <a className="nr" href="#">회원 관리</a>
                       </nav>
                   </div>
               </div>
               <div className="wrapper">
                   <div className="Title">TITLE</div>
                   <div className="right_side_small">뒤로가기</div>
                   <div className="formContent"> 내용 </div>
               </div>
           </body>
       </div>
   );
}

export default admin_taskInfo;