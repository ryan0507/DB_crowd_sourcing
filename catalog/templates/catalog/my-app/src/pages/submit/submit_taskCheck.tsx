import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
interface Task{
    Name : string;
}


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

interface reponse {
    result : string
}



export default function Submit_taskCheck(){
    const [notification, setNotification]:any = useState<boolean>(false)
    const checkHandler:any = (e:Event)=>{
        setNotification((e.target as any).checked)

    }
    // const onSubmit :any = (e:Event) =>{
    //     e.preventDefault();
    // }
    const renderSubmit = () =>{
        if(notification){
            return(
                <button type="submit" onClick={JoinSuccess}>참여 신청하기</button>
            )
        }
        return(
            <button type="submit" disabled>참여 신청하기</button>
        )
    }
    const[task, setTask] = useState<Task>({Name : "Error"})
    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/submitUI/gettask/').then((r)=>{
            let temp: Task = r.data;
            setTask(temp);
        })
    }
    useEffect(()=>{
        getApi()
    },[])

    function JoinSuccess() {
        axios.get('http://127.0.0.1:8000/submitUI/jointask/').then((r)=> {
            let res: reponse = r.data;
            if (res.result === "success"){
                alert("참여 신청이 완료됐습니다.")
            } else {
                alert("오류가 발생했습니다.")
            }
            window.location.replace("/submit/main");
        })
    }



    return(
        <div className="submit_taskCheck">
            <div className="wrapper">
                <div className="Title">개인정보 이용동의서({task.Name})</div>
                <Link to = "/submit/main" className="right_side_small">뒤로가기</Link>
                <div className="formContent">
                    <div className={"task_name"}>
                        <div className={"wrapper_title"}>개인정보 이용동의서</div>
                        <div className={"lightgray_wrapper"}>
                            <p>본인은 귀사에 이력서를 제출함에 따라 [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를 수집, 이용 및 제공하는데 동의합니다.</p>
                            <p>□ 개인정보의 수집 및 이용에 관한 사항 </p>
                            <p> - 수집하는 개인정보 항목 : 성명, 주소, 생년월일, 휴대전화 등 기본 정보</p>
                            <p> - 개인정보의 이용 목적 : 데이터의 품질 관리 및 회원관리을 위해서 활용하며, 목적 외에 용도로는 사용하지 않습니다.</p>
                            <p>□ 개인정보의 보관 및 이용 기간</p>
                            <p>- 귀하의 개인정보를 다음과 같이 보관하며, 수집, 이용 및 제공목적이 달성된 경우 [개인정보 보호법] 제21조에 따라 처리합니다.</p>
                        </div>
                    </div>

                    {/*<div className={"TaskParticipate"}>*/}
                    {/*    <div className={"wrapper_title"}>*/}
                    {/*        <button className="task-participate" onClick={JoinSuccess}>*/}
                    {/*            본인은 개인정보 수집 및 이용에 대하여 동의합니다.*/}
                    {/*        </button>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                    <form className = "noticeConsent">
                        <label htmlFor=""></label>
                        <input type="checkbox" name="agreement" checked= {notification} onChange={checkHandler}/>
                        <span>본 개인정보 이용 동의서를 모두 읽었으며 동의합니다.</span>
                    </form>

                    <div className="next">{renderSubmit()}</div>
                </div>


            </div>
        </div>
    );
}
