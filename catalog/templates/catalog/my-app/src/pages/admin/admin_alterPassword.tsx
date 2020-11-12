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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
        marginBottom: '30px',
        width: '700px',
    },
  }),
);

function Admin_alterPassword() {
  const classes = useStyles();
  return (
      <div className="wrapper">
           <div className="Title">비밀번호 변경</div>
           <div className="formContent">
               <div>
                  <InputBase
                    className={classes.input}
                    placeholder="새로운 비밀번호"
                    inputProps={{ 'aria-label': '비밀번호 변경' }}
                  />
               </div>
           </div>
       </div>
  );
}

export default Admin_alterPassword;