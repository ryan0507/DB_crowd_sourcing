import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
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
    submitFileName : string[];
    Ntuple : number;
    quanScore : number;
    qualScore : number;
    passNonpass : string;
}

interface Column {
    id: 'originTypeID'| 'submitNum' | 'submitDate' | 'submitFileName' | 'Ntuple' | 'quanScore' | 'qualScore' | 'passNonpass' ;
    label: string;
    minWidth?: number;
    align?: 'center';
    alignment?: 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'originTypeID', label: '원본 타입'},
    {id: 'submitNum', label: '회차'},
    {id: 'submitDate', label: '제출일' },
    {id: 'submitFileName',label: '파일'},
    {id: 'Ntuple',label: '튜플수'},
    {id: 'quanScore',label: '정량평가'},
    {id: 'qualScore',label: '정성평가'},
    {id: 'passNonpass',label: '패스 여부'},
];


interface Data {
    originTypeID: string;
    submitNum: number;
    submitDate: string;
    submitFileName: string[];
    Ntuple: number;
    quanScore: number;
    qualScore: number;
    passNonpass: string;
}

function createData(pars : ParsingData): Data[] {
    let temp : Data[] = [];
    pars.data.map((item)=>{
        let tempPass : string = item.passNonpass;
        if(item.passNonpass === "W"){tempPass = '평가 전'}
        temp.push({originTypeID : item.originalTypeID, submitNum : item.submitNum, submitDate : item.submitDate.substring(0,10),
            Ntuple: item.Ntuple, submitFileName : item.submitFileName, quanScore : item.quanScore, qualScore : item.qualScore,
            passNonpass : tempPass})
    })
    return temp;
}

interface TaskForStat{
    TaskID: number;
    Name : string;
    Description: string;
    NSubmittedFile : number;
    NpassedFile : number;
    avgRate : string;
    NSubmittedTuple : number;
    NpassedTuple : number;
    NwaitFile : number;
    NwaitTuple : number;
    Submissionthreshold : string;
    SubOK : boolean;
}


export default function Submit_taskInfo2(props : RouteComponentProps<{task_id : string}>,){
    const[task, setTask] = useState<Task>({name : "Error", tablename : "Error", description: "Error", original_schema : [],
        participate : "P", period: 0, pass_s: "Error", schema: []});
    const getApi = async() =>{
        await axios.get(`http://165.132.105.46:3025/submitUI/taskinfo2/${props.match.params.task_id}/`).then((r)=>{
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
        await axios.get(`http://165.132.105.46:3025/submitUI/taskinfo2_2/${props.match.params.task_id}/`).then((r)=>{
            console.log(r.data);
            let temp: ParsingData = r.data;
            setParsing(temp);
        })
    }
    useEffect(()=>{
        getApi2()
    },[])

    const row = createData(parsing);

    const[stat, setStat] = useState<TaskForStat>({TaskID: 0, Name: "Error", Description: "Error", NSubmittedFile: 0,
        NpassedFile: 0, avgRate: "Error", NSubmittedTuple: 0, NpassedTuple: 0, NwaitFile : 0, NwaitTuple:0,
        Submissionthreshold: "0001-01-01", SubOK : false});
    const getApi3 = async() =>{
        await axios.get(`http://165.132.105.46:3025/submitUI/taskinfo2_3/${props.match.params.task_id}/`).then((r)=>{
            let temp: TaskForStat = r.data;
            setStat(temp);
        })
    }
    useEffect(()=>{
        getApi3()
    },[])


    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const downloadfile = (i:string, name:string) => {
        axios({method: 'GET', url: `http://165.132.105.46:3025/submitUI/downloadcsvfile/${i}/`,
        responseType: 'blob' }).then((r)=>{
            if (r.status === 200) {
                const url = window.URL.createObjectURL(new Blob([r.data], { type: r.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',  name);
                document.body.appendChild(link);
                link.click();
                alert('파일이 다운로드 됩니다.')
            }else if (r.status === 201) {
                alert('NonPass를 받은 파일은 삭제됩니다')
            }else {
                alert('오류가 발생했습니다.')
            }
        })
    }
    const CheckSubmit = () => {

        if (!stat.SubOK) {
            alert("최소 업로드 주기 " + task.period + "일 전에 제출해서 패스를 받았거나 평가 대기 중인 파일이 있습니다. "
                + stat.Submissionthreshold + " 이후에 제출하세요.");
        }else {
            window.location.href = "/submit/submitfile/" + props.match.params.task_id + "/"
        }
    }



    // const[score, setScore] = useState<Score>({score: "0"});
    // const getApi4 = async() =>{
    //     await axios.get(`http://165.132.105.46:3025/submitUI/taskinfo2_4/${props.match.params.task_id}/`).then((r)=>{
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
                    {/*<div className={"MinUpload"}>*/}
                    {/*    <div className={"wrapper_title"}>제출한 파일 수</div>*/}
                    {/*    <div className={"lightgray_wrapper"} >{stat.NSubmittedFile}개</div>*/}
                    {/*</div>*/}
                    {/*<div className={"MinUpload"}>*/}
                    {/*    <div className={"wrapper_title"}>Pass된 파일 수</div>*/}
                    {/*    <div className={"lightgray_wrapper"} >{stat.NpassedFile}개</div>*/}
                    {/*</div>*/}
                    <div className={"MinUpload"}>
                        <div className={"wrapper_title"}>평균 점수</div>
                        <div className={"lightgray_wrapper"} >{stat.avgRate}점</div>
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


                    <div className="submitTaskList">
                        <div className="wrapper_title">나의 제출 현황 </div>
                        <div className={"lightgray_wrapper"}>
                            {/*        <MaterialTable*/}
                            {/*   title={""}*/}
                            {/*  columns={[*/}
                            {/*    { title: '원본 타입[ID]', field: 'originTypeID' , hideFilterIcon: true, headerStyle:{textAlign:'center'}, cellStyle: {textAlign:"center"}},*/}
                            {/*    { title: '회차', field: 'submitNum', hideFilterIcon: true, cellStyle: {textAlign:"center"} },*/}
                            {/*    { title: '제출일', field: 'submitDate', hideFilterIcon: true, cellStyle: {textAlign:"center"} },*/}
                            {/*    {title: '파일이름', field: 'submitFileName', hideFilterIcon: true, cellStyle: {textAlign:"center"}},*/}
                            {/*    {title: '정량평가   점수', field: 'quanScore', hideFilterIcon: true, cellStyle: {textAlign:"center"}},*/}
                            {/*    {title: '정성평가 점수',field: 'qualScore', hideFilterIcon: true, cellStyle: {textAlign:"center"}},*/}
                            {/*    { title: '패스 여부', field: 'passNonpass', lookup: { 'P': 'PASS', 'NP': 'NONPASS' , 'W' : 'WAIT'},*/}
                            {/*        hideFilterIcon: true, cellStyle: {textAlign:"center"}},*/}
                            {/*  ]}*/}
                            {/*   data={row}*/}
                            {/*   // onRowClick={((event, rowData) => handleClick)}*/}
                            {/*   onRowClick={(event, rowData) => {*/}
                            {/*      // Get your id from rowData and use with link.*/}
                            {/*       let tempID : string = ''*/}
                            {/*        toTable.map((item)=>{*/}
                            {/*        })*/}

                            {/*   }}*/}
                            {/*  options={{*/}
                            {/*    filtering: true,*/}
                            {/*      filterRowStyle:{backgroundColor:'#F6F6F6'},*/}
                            {/*      headerStyle:{textAlign:'center'},*/}
                            {/*      searchFieldStyle:{position:'relative', top:'0px', backgroundColor:'white', borderRadius:'5px'}*/}
                            {/*  }}*/}
                            {/*/>*/}
                            <div className={"taskStatistic"}>
                                <div className={"submitFiles"}>제출된 파일 수 : {stat.NSubmittedFile}개  &nbsp; &nbsp; &nbsp;
                                    Pass된 파일 수 : {stat.NpassedFile}개  &nbsp; &nbsp; &nbsp; 대기중인 파일 수: {stat.NwaitFile}개</div>
                                <div className={"passFiles"}>제출된 튜플 수 : {stat.NSubmittedTuple}개 &nbsp; &nbsp; &nbsp;
                                    Pass된 튜플 수 : {stat.NpassedTuple}개  &nbsp; &nbsp; &nbsp; 대기중인 튜플 수: {stat.NwaitTuple}개</div>
                                <div className={"passTuples"}>&nbsp;</div>
                                <Paper className={classes.root}>
                                    <TableContainer className={classes.container}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={'center'}
                                                            style={{ minWidth: column.minWidth, backgroundColor: 'white', fontSize: '16px', fontWeight: 'bold' }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {row.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.submitNum}>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                if (column.id == "submitFileName"){
                                                                    const value = row["submitFileName"];
                                                                    return (
                                                                        <TableCell key={column.id} align='center'
                                                                                   style={{fontSize: '14px', fontWeight: 'normal', color:'black' }}>
                                                                            <button className={"wordButton"} onClick = {(i) => downloadfile(value[1],value[0])}>
                                                                                {column.format && typeof value[0] === 'number' ? column.format(value[0]) : value[0]}
                                                                            </button>
                                                                        </TableCell>
                                                                    );
                                                                }else{
                                                                    return (
                                                                        <TableCell key={column.id} align='center'
                                                                                   style={{fontSize: '14px', fontWeight: 'normal' }}>
                                                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                                                        </TableCell>
                                                                    );
                                                                }
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 20, 30]}
                                        component="div"
                                        count={row.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div>
                        </div>
                        <div className={"TaskParticipate"}>
                            <button className="task-participate" onClick={CheckSubmit}>
                                파일 제출하기
                            </button>
                        </div>
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

