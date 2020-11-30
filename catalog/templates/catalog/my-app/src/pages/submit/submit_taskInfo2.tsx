import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";



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
    period: number;
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

interface ParsingData {
    data : parseToTable[];
}

interface parseToTable{
    originalTypeID : string;
    submitNum : number;
    submitDate : string;
    submitFileName : string;
    quanScore : number;
    qualScore : number;
    passNonpass : string;
}

interface Column {
  id: 'originTypeID'| 'submitNum' | 'submitDate' | 'submitFileName' | 'quanScore' | 'qualScore' | 'passNonpass' ;
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'originTypeID', label: '원본 데이터 타입 ID'},
  { id: 'submitNum', label: '회차'},
  { id: 'submitDate', label: '제출일' },
  { id: 'submitFileName',label: '파일 이름'},
  {id: 'quanScore',label: '정량평가 점수'},
    {id: 'qualScore',label: '정성평가 점수'},
    {id: 'passNonpass',label: '패스 여부'},
];


interface Data {
    originTypeID: string;
    submitNum: number;
    submitDate: string;
    submitFileName: string;
    quanScore: number;
    qualScore: number;
    passNonpass: string;
}

function createData(pars : ParsingData): Data[] {
    let temp : Data[] = [];
    pars.data.map((item)=>{
        temp.push({originTypeID : item.originalTypeID, submitNum : item.submitNum,
            submitDate : item.submitDate.substring(0,10), submitFileName : item.submitFileName, quanScore : item.quanScore,
            qualScore : item.qualScore, passNonpass : item.passNonpass})
    })
  return temp;
}

interface TaskForStat{
    TaskID: number;
    Name : string;
    Description: string;
    NSubmittedFile : number[];
    NpassedFile : number;
    avgRate : string;
}
// interface Score {
//     score : string;
// }

export default function Submit_taskInfo2(props : RouteComponentProps<{task_id : string}>,){
    const[task, setTask] = useState<Task>({name : "Error", tablename : "Error", description: "Error", original_schema : [],
        participate : "P", period: 0, pass_s: "Error", schema: []});
    const getApi = async() =>{
        await axios.get(`http://127.0.0.1:8000/submitUI/taskinfo2/${props.match.params.task_id}/`).then((r)=>{
            let temp: Task = r.data;
            setTask(temp);
        })
    }
    useEffect(()=>{
        getApi()
    },[])

    const[parsing, setParsing] = useState<ParsingData>({data : []});
    const[toTable, setToTable] = useState<parseToTable[]>([]);

    const getApi2 = async() =>{
        await axios.get(`http://127.0.0.1:8000/submitUI/taskinfo2_2/${props.match.params.task_id}/`).then((r)=>{
            let temp: ParsingData = r.data;
            setParsing(temp);
        })
    }
    useEffect(()=>{
        getApi2()
    },[])

    const row = createData(parsing);

    const[stat, setStat] = useState<TaskForStat>({TaskID: 0, Name: "Error", Description: "Error", NSubmittedFile: [],
                        NpassedFile: 0, avgRate: "Error"});
    const getApi3 = async() =>{
        await axios.get(`http://127.0.0.1:8000/submitUI/taskinfo2_3/${props.match.params.task_id}/`).then((r)=>{
            let temp: TaskForStat = r.data;
            setStat(temp);
        })
    }
    useEffect(()=>{
        getApi3()
    },[])

    // const[score, setScore] = useState<Score>({score: "0"});
    // const getApi4 = async() =>{
    //     await axios.get(`http://127.0.0.1:8000/submitUI/taskinfo2_4/${props.match.params.task_id}/`).then((r)=>{
    //         let temp: Score = r.data;
    //         setScore(temp);
    //     })
    // }
    //
    // useEffect(()=>{
    //     getApi4()
    // },[])

    return(
        <div className="submit_taskInfo2">
            <div className="wrapper">
                <div className="Title">{task.name}</div>
                <Link to = '/submit/main2' className="right_side_small">뒤로가기</Link>
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
                    <div className={"MinUpload"}>
                        <div className={"wrapper_title"}>제출한 파일 수</div>
                        <div className={"lightgray_wrapper"} >{stat.NSubmittedFile}개</div>
                    </div>
                    <div className={"MinUpload"}>
                        <div className={"wrapper_title"}>Pass된 파일 수</div>
                        <div className={"lightgray_wrapper"} >{stat.NpassedFile}개</div>
                    </div>
                     <div className={"MinUpload"}>
                        <div className={"wrapper_title"}>평균 점수</div>
                        <div className={"lightgray_wrapper"} >{stat.avgRate}점</div>
                    </div>
                    <div className={"TaskSchema"}>
                        <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                        <ul className={"datatype_list"}>
                            <li>
                                <ul className={"value_list"}>
                                    {task.schema.map((item)=>{
                                        return(
                                            <li>
                                                <div className={"name"}>{item.Big}</div>
                                                <div className={"type"}>({item.small})</div>
                                            </li>
                                        )})}
                                </ul>
                            </li>
                        </ul>

                    </div>

                    <div className={"originDataType"}>
                        <div className={"wrapper_title"}>원본 데이터 타입</div>
                        {task.original_schema.map((item)=>{return(
                            <ul className={"datatype_list"}>
                                <span>[ {item.name} ]</span>
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


            <div className="submitTaskList">
            {/*<div className={"taskStatistic"}>*/}
                <div className="wrapper_title">나의 제출 현황 [ Task : {task.name} ]</div>
                <div className={"lightgray_wrapper"}>
                {/*<div className={"userTable"}>*/}
                    <MaterialTable
               title={""}
              columns={[
                { title: '원본 타입[ID]', field: 'originTypeID' , hideFilterIcon: true, headerStyle:{textAlign:'center'}, cellStyle: {textAlign:"center"}},
                { title: '회차', field: 'submitNum', hideFilterIcon: true, cellStyle: {textAlign:"center"} },
                { title: '제출일', field: 'submitDate', hideFilterIcon: true, cellStyle: {textAlign:"center"} },
                {title: '파일이름', field: 'submitFileName', hideFilterIcon: true, cellStyle: {textAlign:"center"}},
                {title: '정량평가   점수', field: 'quanScore', hideFilterIcon: true, cellStyle: {textAlign:"center"}},
                {title: '정성평가 점수',field: 'qualScore', hideFilterIcon: true, cellStyle: {textAlign:"center"}},
                { title: '패스 여부', field: 'passNonpass', lookup: { 'P': 'PASS', 'NP': 'NONPASS' , 'W' : 'WAIT'},
                    hideFilterIcon: true, cellStyle: {textAlign:"center"}},
              ]}
               data={row}
               // onRowClick={((event, rowData) => handleClick)}
               onRowClick={(event, rowData) => {
                  // Get your id from rowData and use with link.
                   let tempID : string = ''
                    toTable.map((item)=>{
                    })

               }}
              options={{
                filtering: true,
                  filterRowStyle:{backgroundColor:'#F6F6F6'},
                  headerStyle:{textAlign:'center'},
                  searchFieldStyle:{position:'relative', top:'0px', backgroundColor:'white', borderRadius:'5px'}
              }}
            />
            {/*</div>*/}
             </div>
            </div>
        </div>
        </div>
        </div>
    );
}

