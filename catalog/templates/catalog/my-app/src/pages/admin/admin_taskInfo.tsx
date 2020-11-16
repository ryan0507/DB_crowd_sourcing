import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';

function admin_taskInfo(){
   return(
       <div className="wrapper">
           <div className="Title">태스크 이름</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"task_info"}>
                   <div className={"wrapper_title"}>태스크 설명</div>
                   <div className={"lightgray_wrapper"}>이 태스크는 이런 태스크입니다.</div>
               </div>

               <div className={"task_howToPass"}>
                   <div className={"wrapper_title"}>태스크 PASS 기준</div>
                   <div className={"lightgray_wrapper"}>이 태스크는 이렇게 해야 통과되는 태스크입니다.</div>
               </div>

               <div className={"originDataType"}>
                   <div className={"wrapper_title"}>원본 데이터 타입</div>
                   <Link className={"addDataType"} to = "/admin/datatypeadd_exist">원본 데이터 타입 추가하기</Link>
                   <ul className={"datatype_list"}>
                       <li>
                           <div className={"datatypeID"}>ID : 001</div>
                           <ul className={"value_list"}>
                               <li>
                                   <div className={"decidedName"}>음식점 이름</div>
                                   <div className={"originName"}>음식점 이름</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 매출</div>
                                   <div className={"originName"}>월 매출</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 고객 수</div>
                                   <div className={"originName"}>월 고객 수</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 순이익</div>
                                   <div className={"originName"}>월 순이익</div>
                               </li>
                           </ul>
                       </li>
                   </ul>

               </div>

               <div className={"originDataTypeRequest"}>
                   <div className={"wrapper_title"}>원본 데이터 타입 요청</div>
                   <ul className={"datatype_list"}>
                       <li>
                           <div className={"datatypeID"}>ID : 001</div>
                           <ul className={"value_list"}>
                               <li>
                                   <div className={"decidedName"}>음식점 이름</div>
                                   <div className={"originName"}>음식점 이름</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 매출</div>
                                   <div className={"originName"}>월 매출</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 고객 수</div>
                                   <div className={"originName"}>월 고객 수</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 순이익</div>
                                   <div className={"originName"}>월 순이익</div>
                               </li>

                           </ul>
                           <button className={"_button"} id={"yes"}>승인</button>
                           <button className={"_button"} id={"no"}>거절</button>
                       </li>
                   </ul>
               </div>

               <div className={"applicantList"}>
                   <div className={"wrapper_title"}>참여 신청자 명단</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"name"}>이름</div>
                       <div className={"score"}>평가점수</div>
                       <ul className={"applicants"}>
                           <li>
                               <div className={"sequenceNum"}>1.</div>
                               <div className={"personal_name"}>한채은</div>
                               <div className={"personal_score"}>8점</div>
                               <button className={"_button"} id={"yes"}>승인</button>
                               <button className={"_button"} id={"no"}>거절</button>
                           </li>
                           <li>
                               <div className={"sequenceNum"}>2.</div>
                               <div className={"personal_name"}>이수현</div>
                               <div className={"personal_score"}>3점</div>
                               <button className={"_button"} id={"yes"}>승인</button>
                               <button className={"_button"} id={"no"}>거절</button>
                           </li>
                       </ul>
                   </div>
               </div>

               <div className={"taskStatistic"}>
                   <div className={"wrapper_title"}>태스크 통계</div>
                   <div className={"lightgray_wrapper"}>
                       <div className={"submitFiles"}>제출된 파일 수 : 00개</div>
                       <div className={"passFiles"}>Pass된 파일 수 : 0개</div>
                       <div className={"passTuples"}>Pass된 튜플 수 : 000개</div>
                       {/*<ul className={"applicants"}>*/}
                       {/*    <li>*/}
                       {/*        <div className={"sequenceNum"}>1.</div>*/}
                       {/*        <div className={"personal_name"}>한채은</div>*/}
                       {/*        <div className={"personal_score"}>8점</div>*/}
                       {/*        <button className={"_button"} id={"yes"}>승인</button>*/}
                       {/*        <button className={"_button"} id={"no"}>거절</button>*/}
                       {/*    </li>*/}
                       {/*    <li>*/}
                       {/*        <div className={"sequenceNum"}>2.</div>*/}
                       {/*        <div className={"personal_name"}>이수현</div>*/}
                       {/*        <div className={"personal_score"}>3점</div>*/}
                       {/*        <button className={"_button"} id={"yes"}>승인</button>*/}
                       {/*        <button className={"_button"} id={"no"}>거절</button>*/}
                       {/*    </li>*/}
                       {/*</ul>*/}
                   </div>
               </div>


               <div className = "task_statistics">
                   <Link to = "/admin/filedetail">새마을식당_10월.csv</Link>
               </div>
           </div>
       </div>
   );
}

export default admin_taskInfo;