import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {Component, MouseEvent, useReducer, useState} from 'react';
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

interface Value {
    id: number,
    datatypeName: string;
    datatypeType: string;
}
const defaultValue: Value = {
    id: 0,
    datatypeName: '',
    datatypeType: '',
}

type tempValue = {
    name: string;
    type: string;
}

const defaultTempValue: tempValue ={
    name: '',
    type: '',
}

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

interface Props{
    onSchemaChange <P extends keyof tempValue> (prop: P, value: any) : void;
}

const Admin_tableSchema_add = ({onSchemaChange}:Props) => {
  const pushButton = <P extends keyof tempValue>(prop:P, x : any) => {setTempValue({..._tempValue, [prop] : x}); onSchemaChange(prop, x)}
  const [_tempValue, setTempValue] = useState(defaultTempValue);
  const onValueChange =<P extends keyof tempValue> (prop: P, value: tempValue[P]) => {
      setTempValue({..._tempValue, [prop]: value});
      onSchemaChange(prop, value)
  }
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


  return (
      <div className={"admin_tableSchema_add"}>
          <div className={"wrapper_title"}>속성 이름<a>속성 타입</a></div>

              <div className={"datatypeInput"}>
                    <InputBase
                      className={"datatypeName"}
                      placeholder="해당 속성의 이름을 작성해주세요."
                      inputProps={{ 'aria-label': '테이블 스키마 속성' }}
                      value={_tempValue.name}
                      onChange={e=> {
                          onValueChange('name', e.target.value)
                      }}
                    />

                    <div className={"dropdown"}>
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={open}
                          onClose={handleClose}
                          onOpen={handleOpen}
                          style={{textAlign:'center'}}
                        >
                            <MenuItem value={"integer"} onClick={e => pushButton('type', 'integer')}>integer</MenuItem>
                            <MenuItem value={"string"} onClick={e => pushButton('type', 'string')}>string</MenuItem>
                            <MenuItem value={"float"} onClick={e => pushButton('type', 'float')}>float</MenuItem>
                            <MenuItem value={"boolean"} onClick={e => pushButton('type', 'boolean')}>boolean</MenuItem>
                        </Select>
                      </FormControl>
                   </div>
              </div>
             <div className={"notice"}>*속성 이름에는 특수문자를 사용할 수 없습니다.</div>
      </div>
  );
}
export default Admin_tableSchema_add;