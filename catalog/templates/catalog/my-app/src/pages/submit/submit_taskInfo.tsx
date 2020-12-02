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



const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    }
});

interface Task {
    name: string;
    tablename: string;
    description: string;
    pass_s: string;
    period: string;
    schema: EachSchema[];
    original_schema: OriginalSchema[];
    participate: string;
}

interface EachSchema {
    Big: string;
    small: string;
}
interface OriginalSchema {
    name : string;
    schema : EachSchema[];
}



export default function Submit_taskInfo(props : RouteComponentProps<{task_id : string}>,){
    const[task, setTask] = useState<Task>({name : "Error", tablename : "Error", description: "Error", original_schema : [],
        participate : "P", period: "Error", pass_s: "Error", schema: []});
    const getApi = async() =>{
        await axios.get(`http://127.0.0.1:8000/submitUI/taskinfo1/${props.match.params.task_id}/`).then((r)=>{
            let temp: Task = r.data;
            setTask(temp);
        })
    }
    useEffect(()=>{
        getApi()
    },[])

    function join() {
        if (task.participate === "P") {
            alert("이미 참여한 태스크 입니다.")
        }
        else if (task.participate === "W") {
            alert("이미 참여 신청 완료한 태스크입니다.")
        }
        else {
            window.location.replace("/submit/taskcheck")
        }

    }


    return(
        <div className="submit_taskInfo">
            <div className="wrapper">
                <div className="Title">{task.name}</div>
                <Link to = "/submit/main" className="right_side_small">뒤로가기</Link>
                <div className="formContent">
                    <div className={"TaskName"}>
                        <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                        <div className={"lightgray_wrapper"}>{task.tablename}</div>
                    </div>
                    <div className={"TaskInfo"}>
                        <div className={"wrapper_title"}>태스크 설명</div>
                        <div className={"lightgray_wrapper"}>{task.description}</div>
                    </div>
                    <div className={"TaskPassStandard"}>
                        <div className={"wrapper_title"}>태스크 PASS 기준</div>
                        <div className={"lightgray_wrapper"}>{task.pass_s}</div>
                    </div>
                    <div className={"MinUpload"}>
                        <div className={"wrapper_title"}>최소 업로드 주기</div>
                        <div className={"lightgray_wrapper"} >{task.period}일</div>
                    </div>
                    <div className={"TaskSchema"}>
                        <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                        <ul className={"value_list"}>
                            {task.schema.map((item)=>{
                                return(
                                    <li>
                                        <div className={"name"}>{item.Big}</div>
                                        <div className={"type"}>({item.small})</div>
                                    </li>
                                )})}
                        </ul>
                    </div>

                    <div className={"originDataType"}>
                        <div className={"wrapper_title"}>원본 데이터 타입</div>
                        {task.original_schema.map((item)=>{return(
                            <ul className={"datatype_list"}>
                                <span>[ {item.name} ] :</span>
                                <li>
                                    <ul className={"value_list"}>
                                        {item.schema.map((item2) => {return(
                                            <li>
                                                <div className={"decidedName"}>{item2.Big}</div>
                                                <div className={"originName"}>{item2.small}</div>
                                            </li>
                                        )})}
                                    </ul>
                                </li>
                            </ul>
                        )})}
                    </div>
                    <div className={"TaskParticipate"}>
                        <button className="task-participate" onClick={join}>
                            {task.participate === "P" ? "참여 중인 태스크": task.participate === "W" ? "참여 신청한 태스크":"참여 신청하기"}
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}

