import {BrowserRouter as Router, Route, Link, RouteComponentProps} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            display: 'block',
            marginTop: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },

    }),
);



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
interface time{
    subtime : number;
}
interface state {
    state: string;
    message: string;
}


export default function Submit_submitFile(props : RouteComponentProps<{task_id : string}>,) {
    const [task, setTask] = useState<Task>({
        name: "Error", tablename: "Error", description: "Error", original_schema: [],
        participate: "P", period: "Error", pass_s: "Error", schema: []
    });
    const getApi = async () => {
        await axios.get(`http://127.0.0.1:8000/submitUI/taskinfo1/${props.match.params.task_id}/`).then((r) => {
            let temp: Task = r.data;
            setTask(temp);
        })
    }
    useEffect(() => {
        getApi()
    }, [])

    const [st, setSt] = useState<time>({subtime:-1})
    const getApi2 = async () => {
        await axios.get(`http://127.0.0.1:8000/submitUI/getsubtime/${props.match.params.task_id}/`).then((r) => {
            let temp: time = r.data;
            setSt(temp);
        })
    }
    useEffect(() => {
        getApi2()
    }, [])

    const [startDate, setStartDate] = useState('');
    const signUpstartDate = (e:any) => {
        setStartDate(e.target.value);
    }
    const [endDate, setEndDate] = useState('');
    const signUpendDate = (e:any) => {
        setEndDate(e.target.value);
    }

    const classes = useStyles();
    const [minUpload, setMinUpload] = React.useState<string>(' ');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMinUpload(event.target.value as string);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const [file, setFile] = React.useState<Blob>(new Blob(['<div>Hello Blob!</div>']));
    const [subbutton, setButton] = React.useState<boolean>(true);

    const signFile = (e:any) => {
        setFile(e.target.files[0]);
    }


    const submit_file = () => {
        if (!subbutton) {
            alert("제출 중입니다. 페이지를 떠나지 말고 잠시만 기다려 주세요.")
        }
        else if (startDate === "" || endDate ==="" || file === null || minUpload === "") {
            alert("주어진 양식을 모두 입력해 주세요. 파일명에 이름을 넣어주세요.")
        }
        else if (startDate > endDate) {
            alert("데이터 수집 시작일이 종료일보다 앞에 있어야합니다.")
        }
        else {
            const formData = new FormData();
            formData.append('TaskID', props.match.params.task_id);
            formData.append('OriginalID', minUpload);
            formData.append('SubmissionNumber', st.subtime.toString());
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('file', file);
            console.log(minUpload);
            axios.post('http://127.0.0.1:8000/submitUI/postfile/', formData,{headers: {"content-type": "multipart/form-data"}})
                .then(res => {console.log(res.data)
                    let st: state = res.data;
                    if (st.state === "200") {
                        window.location.replace("/submit/submitfilecheck/" + st.message + "/");
                    } else if (st.state === "202") {
                        alert(st.message);
                    } else {
                        alert(st.message);
                        window.location.replace("/submit/main2/");
                    }})
                .catch(err => {
                    alert("오류가 발생했습니다.");
                    window.location.replace("/submit/main2/")
                })
        }
    }




    return (
        <div className="submit_submitFile">
            <div className="wrapper">
                <div className="Title">{task.name} Task 제출하기</div>
                <Link to={'/submit/taskinfo2/' + props.match.params.task_id + "/"}
                      className="right_side_small">뒤로가기</Link>
                <div className="formContent">
                    <div className={"TaskSchema"}>
                        <div className={"TaskName"}>
                            <div className={"wrapper_title"}>제출 회차</div>
                            <div className={"lightgray_wrapper"}>{st.subtime}회</div>
                        </div>
                        <div className={"dataTableSchema"}>
                            <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                            <ul className={"value_list"}>
                                {task.schema.map((item) => {
                                    return (
                                        <li>
                                            <div className={"name"}>{item.Big}</div>
                                            <div className={"type"}>({item.small})</div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className={"originDataType"}>
                            <div className={"wrapper_title"}>원본 데이터 타입</div>
                                <ul className={"datatype_list"}>
                                    {task.original_schema.map((item) => {
                                        return (
                                            <li className={"dataVertical"}>
                                                <div className={"datatypeID"}>[ {item.name} ] :</div>

                                                    {item.schema.map((item2) => {
                                                        return (
                                                            <ul className={"value_list"}>
                                                                <li>
                                                                    <div className={"decidedName"}>{item2.Big}</div>
                                                                    <div className={"originName"}>{item2.small}</div>
                                                                </li>
                                                            </ul>
                                                        )
                                                    })}
                                            </li>
                                        )
                                    })}
                                </ul>
                        </div>
                        <div className={"minUpload"}>
                            <div className={"wrapper_title"}>원본 데이터 타입 선택</div>
                            <div className={"dropdown"}>
                                <FormControl className={classes.formControl}>
                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        open={open}
                                        onClose={handleClose}
                                        onOpen={handleOpen}
                                        onChange={handleChange}
                                        style={{textAlign: 'center'}}>
                                        {task.original_schema.map((item) => {
                                            return (
                                                <MenuItem value={item.name}>{item.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className={"dataTable_name"}>
                            <div className={"wrapper_title"}>데이터 수집날짜(시작일, 종료일)</div>
                            <input type="date" className="select__birth" onChange={signUpstartDate} value={startDate} ></input>
                            <div className={"wave"}>~</div>
                            <input type="date" className="select__birth" onChange={signUpendDate} value={endDate} ></input>
                        </div>
                        <div className={"fileSubmit"}>
                            <div className={"wrapper_title"}>제출 파일 선택</div>
                            <form>
                                <input className={"custom-file-input"}  type="file" id = "csvfile" accept='.csv'  onChange = {signFile}/>
                            </form>
                        </div>
                        <div className={"TaskParticipate"}>
                            <div className={"wrapper_title"}>
                                <button className="task-participate" onClick={submit_file}>{subbutton? "파일 제출하기":"제출 중..."}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}