import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import axios from "axios";
import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";


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
    const [minUpload, setMinUpload] = React.useState<string | number>('');
    const [passNonpass, setPassNonpass] = React.useState<string | number>('');
    const classes = useStyles();

    useEffect(() => {
        getApi()
    }, [])


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



                    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
                        setMinUpload(event.target.value as number);
                    };

                    const handleClose = () => {
                        setOpen(false);
                    };

                    const handleOpen = () => {
                        setOpen(true);
                    };

                    const pass_handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
                        setPassNonpass(event.target.value as number);
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
                                    <div className={"lightgray_wrapper_file"}>새마을식당.csv</div>
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
                                    <div className={"lightgray_wrapper"}>{item.QuanAssessment}</div>
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
                                            value={minUpload}
                                            onChange={handleChange}
                                            style={{textAlign: 'center'}}
                                        >
                                            <MenuItem value="">
                                                <em>선택 안 함</em>
                                            </MenuItem>
                                            <MenuItem value={10}>1점</MenuItem>
                                            <MenuItem value={20}>2점</MenuItem>
                                            <MenuItem value={30}>3점</MenuItem>
                                            <MenuItem value={40}>4점</MenuItem>
                                            <MenuItem value={50}>5점</MenuItem>
                                            <MenuItem value={60}>6점</MenuItem>
                                            <MenuItem value={70}>7점</MenuItem>
                                            <MenuItem value={80}>8점</MenuItem>
                                            <MenuItem value={90}>9점</MenuItem>
                                            <MenuItem value={100}>10점</MenuItem>
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
                                            value={passNonpass}
                                            onChange={pass_handleChange}
                                            style={{textAlign: 'center'}}
                                        >
                                            <MenuItem value="">
                                                <em>선택 안 함</em>
                                            </MenuItem>
                                            <MenuItem value={10}>PASS</MenuItem>
                                            <MenuItem value={20}>NON-PASS</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>


                            <div>
                                <Link to="/rater/main">
                                    <button className="rater_fileDetailSubmit">제출</button>
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
