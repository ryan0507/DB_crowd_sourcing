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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        height: '0px',
    },
    input: {
        marginBottom: '30px',
    },
    iconButton: {
        marginBottom: '30px',
        padding: 10,
    },
  }),
);

export default function CustomizedInputBase() {
  const classes = useStyles();
  return (
      <div className="wrapper">
           <div className="Title">회원 List</div>
           <div className="right_side_search">
               <Paper component="form" className={classes.root}>
                  <InputBase
                    className={classes.input}
                    placeholder="회원 검색"
                    inputProps={{ 'aria-label': '회원 검색' }}
                  />
                  <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
           </div>
           <div className="formContent">
               <div>내용</div>
           </div>
       </div>
  );
}