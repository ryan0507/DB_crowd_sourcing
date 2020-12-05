import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import {black, white} from "material-ui/styles/colors";
import table from "../table";
import App from "../../App";
import axios from "axios";

function Admin_alterPassword() {

    const [pw, setPw] = useState("");
    const [rePw, setRePw] = useState("");

    const handlePWChange = (e:any) => {
        setPw(e.target.value);
    }
    const handleRePWChange = (e:any) => {
        setRePw(e.target.value);
    }
    const AlterPassword = (event : React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        var isnull = false;
        if(pw === "" || rePw === ""){
            isnull = true;
        }
        if(!isnull && pw === rePw){
            alert("alter");
            axios.post('http://127.0.0.1:8000/adminUI/alterpw/',{
                Password : pw,
                MainID : 'ad 1',
            }).then((r) => {
                console.log(r.data);
                window.location.replace("/admin/main");
            }).catch((err) => {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            })
        }
        else if(isnull){
            alert("모든 정보를 입력해주세요.");
        }
        else{
            alert("입력하신 비밀번호가 일치하지 않습니다.");
        }
    }

  return (
      <div className={"adminAlterPassword"}>
          <div className="wrapper">
               <div className="Title">비밀번호 변경</div>
               <div className="formContent">
                   <div className={"userName"}>
                       Name
                       <span className={"contentName"}>관리자</span>
                   </div>
                   <div className={"userID"}>
                       ID
                       <span className={"contentID"}>admin</span>
                   </div>
                   <div className={"newPassword"}>
                       New Password
                      <InputBase
                          className={"newPassword"}
                        placeholder="새로운 비밀번호"
                        inputProps={{ 'aria-label': '비밀번호 변경' }}
                          onChange = {handlePWChange}
                          />
                   </div>
                   <div className={"confirmNewPassword"}>
                       Repeat Password
                      <InputBase
                          className={"newPassword"}
                        placeholder="비밀번호 확인"
                        inputProps={{ 'aria-label': '비밀번호 변경' }}
                          onChange = {handleRePWChange}
                      />
                   </div>
                   <div className={"saveButton"}>
                       <button type="submit" onClick={(event) => AlterPassword(event)}>저장</button>
                   </div>
                   </div>
           </div>
      </div>
  );
}

export default Admin_alterPassword;