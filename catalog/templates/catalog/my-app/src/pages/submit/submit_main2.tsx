import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

interface Task{
    TaskID: string;
    Name : string;
    Description: string;
    NSubmittedFile : string;
    NpassedFile : string;
    avgRate : string;
}
interface Score {
    score : string;
}


const Submit_main2 = ()=>{
    const[task, setTask] = useState<Task[]>([]);
    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/submitUI/main2task').then((r)=>{
            let temp: Task[] = r.data;
            setTask(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

    const[score, setScore] = useState<Score>({score: "0"});
    const getApi2 = async() =>{
        await axios.get('http://127.0.0.1:8000/submitUI/main2_2task').then((r)=>{
            let temp: Score = r.data;
            setScore(temp);
        })
    }

    useEffect(()=>{
        getApi2()
    },[])

    return(
        <div className={"wrapper"}>
            <div className="Title">참여중인 태스크</div>
            <Link to = "/submit/main" className="right_side_small">현재 나의 평가 점수: {score.score}점</Link>
            {task.map((item)=>{
                return(
                    <ul className={"task_list"}>
                        <li>
                            <Link to = {`/submit/taskinfo2/${item.TaskID}`}>
                                <div className="content_list">
                                    <div className={"taskName"}>{item.Name}</div>
                                    <div className={"applicant"}>제출파일(Pass파일): {item.NSubmittedFile}개({item.NpassedFile}개)</div>
                                    <div className={"aboutTask"}>{item.Description}</div>
                                    <div className={"applicant"}>평균 평가 점수: {item.avgRate}점</div>
                                </div>
                            </Link>
                        </li>
                    </ul>
                )
            })}

        </div>
    );
}


export default Submit_main2;