import {BrowserRouter as Router, Route, Link, RouteComponentProps} from 'react-router-dom';
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
interface message {
    TotalColumn : string;
    NullRow : string;
    SelfDupRow : string;
    OtherDupRow : string;
    NullPercent : string;
    TotalRow : string;
    RestRow : string;
    Score : string;
}

export default function Submit_taskSubmitCheck(props : RouteComponentProps<{id : string}>,) {
    const [notification, setNotification]:any = useState<message>({
        TotalColumn : "",
        NullRow : "",
        SelfDupRow : "",
        OtherDupRow : "",
        NullPercent : "",
        TotalRow : "",
        RestRow : "",
        Score : ""
    })
    const getApi = async() => {
        axios.get(`http://165.132.105.46:3025/submitUI/getresult/${props.match.params.id}/`).then((r)=> {
                console.log(r.data);
                let temp: message = r.data;
                setNotification(temp);
            }
        )
    }
    useEffect(()=>{
        getApi()
    },[])

    return(
        <div className="submit_taskCheck">
            <div className="wrapper">
                <div className="Title">결과 확인</div>
                <div className="right_side_small"></div>
                <div className="formContent">
                    <div className={"task_name"}>
                        <div className={"wrapper_title"}>제출 결과</div>
                        <p className={"lightgray_wrapper"}>
                            <p>데이터 제출이 완료 됐습니다</p>
                            <p>제출한 전체 열: {notification.TotalColumn}개</p>
                            <p>null비율 50%이상인 행: {notification.NullRow}개</p>
                            <p>(실수에서의 중복기준은 소수점 4째자리에서 반올림한 숫자입니다.)</p>
                            <p>해당 데이터에서의 중복 + 과거 해당 제출자가 제출한 데이터와 중복 개수: {notification.SelfDupRow}개</p>
                            <p>다른 사람이 제출한 데이터와 중복개수: {notification.OtherDupRow}개</p>
                            <p>남은 행 중에서 null 값 비율: {notification.NullPercent}%</p>
                            <p>전체 제출 row개수 / 실제 제출된 행 개수(중복열,null열 제거): {notification.TotalRow}개/{notification.RestRow}개</p>
                            <p>위를 모두 고려한 정량평가 점수: {notification.Score}</p>
                            <p>"이곳에서 표시된 행의 개수는 평가에 반영된 행의 개수입니다. 실제 Pass를 받아 저장될때 저장되는 튜플의 개수가 줄어들 수 있습니다."</p>
                        </p>
                    </div>
                    <div className={"TaskParticipate"}>
                        <div className="next">
                            <Link to = "/submit/main2">
                                <button className="task-participate">
                                    확인
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
