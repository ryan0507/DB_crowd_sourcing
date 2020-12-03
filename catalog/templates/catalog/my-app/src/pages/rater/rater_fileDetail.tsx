import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, { Fragment, useEffect, useState} from 'react';
import axios from "axios";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import {FaceRounded} from "@material-ui/icons";


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface fileDetail{
    SubmissionID: number,
    TaskDescription: string,
    TaskThreshold: number,
    StartDate: Date,
    EndDate: Date,
    TableName: string,
    TaskSchema: string,
    OriginSchema: string,
    TaskName : string,
    SubmissionNumber : number,
    OriginSchemaMapping : string,
    OriginTypeID : number
    QuanAssessment : number,
    FileName: string;
}

interface Score{
    SubmissionID : string,
    QualAssessment : number,
    P_NP : string,
}

interface state {
    "state": string;
    "message": string;
}

export default function Rater_taskDetail(props : RouteComponentProps<{submission_id : string}>,) {
    const [task, setTask] = useState<fileDetail[]>([]);

    const getApi = async () => {
        await axios.get(`http://127.0.0.1:8000/raterUI/fileDetail/${props.match.params.submission_id}/`).then((r) => {
            let temp: fileDetail[] = r.data;
            setTask(temp);
        })
    }
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100px',
            },
            container: {
                maxHeight: 440,
            },
            formControl: {
                margin: theme.spacing(2),
                minWidth: 120,
            },
        }),
    );

    const [open, setOpen] = React.useState(false);
    const [pass_open, pass_setOpen] = React.useState(false);
    const classes = useStyles();
    const initialScore = {
        SubmissionID : props.match.params.submission_id,
        QualAssessment : 0,
        P_NP : '',
    }
    const [score, setScore] = useState<Score>(initialScore);

    useEffect(() => {
        getApi()
    }, [])

    const downloadfile = (i:string, name:string) => {
        axios({method: 'GET', url: `http://127.0.0.1:8000/submitUI/downloadcsvfile/${i}/`,
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

    const handleSubmitScore = (event : React.FormEvent<HTMLButtonElement>) =>{
        event.preventDefault();
        axios.post(`http://127.0.0.1:8000/raterUI/fileDetailMerge/`, {
            QualAssessment : score.QualAssessment,
            P_NP : score.P_NP,
            SubmissionID : score.SubmissionID,
        }).then((r) => {
            let user : state = r.data;
            if (user.state === "s"){
                alert(user.message);
                window.location.replace("/rater/main");
            }
            else if(user.state === "noQual" || user.state === "noPNP" || user.state === "nothing"){
                alert(user.message);
            }
            console.log(r);
            console.log(r.data);
          }).catch((err) => {
             console.log(err.response.data);
             console.log(err.response.status);
             console.log(err.response.headers); } )
    };

    return (
        <div className="rater_fileDetail">
            <div className="wrapper">
                {task.map((item) => {
                    const originSchemaArr = item.OriginSchemaMapping.split("%");
                    const taskSchemaArr = item.TaskSchema.split("%");

                    const final_originSchemaArr = [];
                    const final_taskSchemaArr = [];

                    for (var i = 0; i < originSchemaArr.length / 2; i++) {
                        const new_key = originSchemaArr[2 * i];
                        const new_val = originSchemaArr[2 * i + 1];
                        final_originSchemaArr.push([new_key, new_val])
                    }

                    for (var i = 0; i < taskSchemaArr.length / 2; i++) {
                        const task_new_key = taskSchemaArr[2 * i];
                        const task_new_val = taskSchemaArr[2 * i + 1];
                        final_taskSchemaArr.push([task_new_key, task_new_val])
                    }

                    const originSchemaList = final_originSchemaArr.map((new_item) => {
                        return (
                            <li>
                                <div className={"name"}>{new_item[0]}</div>
                                <div className={"type"}>{new_item[1]}</div>
                            </li>
                        );
                    });

                    const taskSchemaList = final_taskSchemaArr.map((new_item) => {
                        return (
                            <li>
                                <div className={"name"}>{new_item[0]}</div>
                                <div className={"type"}>{new_item[1]}</div>
                            </li>
                        );
                    });



                    const handleInputChange = <P extends keyof Score> (item : P, value: Score[P]) =>{
                        setScore({...score, [item] : value});
                    }

                    const handleClose = () => {
                        setOpen(false);
                    };

                    const handleOpen = () => {
                        setOpen(true);
                    };

                    const pass_handleInputChange = <P extends keyof Score> (item : P, value: Score[P]) =>{
                        setScore({...score, [item] : value});
                    };

                    const pass_handleClose = () => {
                        pass_setOpen(false);
                    };

                    const pass_handleOpen = () => {
                        pass_setOpen(true);
                    };


                    return (
                        <React.Fragment>
                            <div className="Title">{item.TaskName}</div>
                            <Link to="/rater/main" className="right_side_small">뒤로가기</Link>
                            <div className="formContent">
                                <div className={"task_info"}>
                                    <div className={"wrapper_title"}>태스크 설명</div>
                                    <div className={"lightgray_wrapper"}>{item.TaskDescription}</div>
                                </div>
                                <div className={"task_howToPass"}>
                                    <div className={"wrapper_title"}>태스크 PASS 기준</div>
                                    <div className={"lightgray_wrapper"}>{item.TaskThreshold}</div>
                                </div>
                                <div className={"task_num"}>
                                    <div className={"wrapper_title"}>회차</div>
                                    <div className={"lightgray_wrapper"}>{item.SubmissionNumber}회</div>
                                </div>
                                <div className={"task_duration"}>
                                    <div className={"wrapper_title"}>기간</div>
                                    <div className={"lightgray_wrapper"}>{item.StartDate} ~ {item.EndDate}</div>
                                </div>
                                <div className={"file_download"}>
                                    <div className={"wrapper_title"}>파일 다운로드</div>

                                    <div className={"lightgray_wrapper_file"}>
                                        <button onClick = {(i) => downloadfile(props.match.params.submission_id, item.FileName)}>
                                            {item.FileName}
                                        </button>
                                    </div>
                                </div>
                                <div className={"taskData_table_name"}>
                                    <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                                    <div className={"lightgray_wrapper"}>{item.TableName}</div>
                                </div>
                                <div className={"dataTableSchema"}>
                                    <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                                    <ul className={"datatype_list"}>
                                        <ul className={"value_list"}>
                                            {taskSchemaList}
                                        </ul>
                                    </ul>

                                </div>
                                <div className={"originDataType"}>
                                    <div className={"wrapper_title"}>선택된 원본 데이터 타입 - ID
                                        : {item.OriginTypeID}[{item.OriginSchema}]
                                    </div>
                                    <ul className={"datatype_list"}>
                                        <ul className={"value_list"}>
                                            {originSchemaList}
                                        </ul>
                                    </ul>

                                </div>
                                <div className={"score"}>
                                    <div className={"wrapper_title"}>정량평가 점수</div>
                                    <div className={"lightgray_wrapper"}>{item.QuanAssessment}점</div>
                                </div>


                                <div className={"minUpload"}>
                                    <div className={"wrapper_title"}>점수</div>
                                    <div className={"dropdown"}>
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                labelId="demo-controlled-open-select-label"
                                                id="demo-controlled-open-select"
                                                open={open}
                                                onClose={handleClose}
                                                onOpen={handleOpen}
                                                value={score.QualAssessment}
                                                onChange={e=> handleInputChange('QualAssessment', (e.target.value as number))}
                                                style={{textAlign: 'center'}}
                                            >
                                                <MenuItem value="">
                                                    <em>선택 안 함</em>
                                                </MenuItem>
                                                <MenuItem value={1}>1점</MenuItem>
                                                <MenuItem value={2}>2점</MenuItem>
                                                <MenuItem value={3}>3점</MenuItem>
                                                <MenuItem value={4}>4점</MenuItem>
                                                <MenuItem value={5}>5점</MenuItem>
                                                <MenuItem value={6}>6점</MenuItem>
                                                <MenuItem value={7}>7점</MenuItem>
                                                <MenuItem value={8}>8점</MenuItem>
                                                <MenuItem value={9}>9점</MenuItem>
                                                <MenuItem value={10}>10점</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>


                                <div className={"passNonpass"}>
                                    <div className={"wrapper_title"}>P/NP</div>
                                    <div className={"dropdown"}>
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                labelId="demo-controlled-open-select-label"
                                                id="demo-controlled-open-select"
                                                open={pass_open}
                                                onClose={pass_handleClose}
                                                onOpen={pass_handleOpen}
                                                value={score.P_NP}
                                                onChange={e=> pass_handleInputChange('P_NP', (e.target.value as string))}
                                                style={{textAlign: 'center'}}
                                            >
                                                <MenuItem value="">
                                                    <em>선택 안 함</em>
                                                </MenuItem>
                                                <MenuItem value={"P"}>PASS</MenuItem>
                                                <MenuItem value={"NP"}>NON-PASS</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div>
                                    <Link to="/rater/main">
                                        <button className="rater_fileDetailSubmit" onClick={(event) => handleSubmitScore(event)}>제출</button>
                                    </Link>
                                </div>

                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    );
}
