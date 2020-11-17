import React from 'react';
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

function Admin_alterPassword() {
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
                          />
                   </div>
                   <div className={"confirmNewPassword"}>
                       Repeat Password
                      <InputBase
                          className={"newPassword"}
                        placeholder="비밀번호 확인"
                        inputProps={{ 'aria-label': '비밀번호 변경' }}
                      />
                   </div>
                   <input type="submit" value="저장"/>
               </div>
           </div>
      </div>
  );
}

export default Admin_alterPassword;