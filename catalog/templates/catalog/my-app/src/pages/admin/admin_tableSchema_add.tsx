// import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
// import React from 'react';
// import TableSchemaItem from './tableSchemaItem';
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
//
// interface Props{}
//
// interface TableSchema {
//     id: number;
//     valueName: string;
//     valueType: string;
// };
//
// interface State{
//     type: string;
//     input: string;
//     schemaValues: TableSchema[];
// }
//
// class Admin_tableSchema_add extends React.Component<Props, State> {
//
//     _id: number = 0;
//     state: State= {
//         type: "",
//         input: "",
//         schemaValues: [],
//     }
//
//     onChange = (e: React.FormEvent<HTMLInputElement>) : void => {
//         const { value } = e.currentTarget;
//         this.setState({
//             input: value,
//         })
//     }
//
//     onClick = (e: React.FormEvent<HTMLInputElement>) : void => {
//         const { value } = e.currentTarget;
//         this.setState({
//             type: value,
//         })
//     }
//
//     onSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
//         e.preventDefault();
//         this.setState(({ schemaValues, input, type }) => ({
//             type: "",
//             input: "",
//             schemaValues: schemaValues.concat({
//                 id: this._id++,
//                 valueName: input,
//                 valueType: type,
//             }),
//         }))
//     }
//     onRemove = (_id: number): void =>{
//         this.setState(({ schemaValues })=> ({
//             schemaValues: schemaValues.filter((_value)=> _value.id !== _id),
//         }))
//     }
//
//     onUpdate=():void =>{}
//     render() {
//         const {onSubmit, onChange, onRemove, onUpdate} = this
//         const {input, schemaValues} = this.state
//
//         const schemaItemValues = schemaValues.map((_value) => (
//             <TableSchemaItem
//                 onRemove={() => onRemove(_value.id)}
//                 valueName={_value.valueName}
//                 valueType={_value.valueType}
//                 onUpdate={() => onUpdate()}
//             ></TableSchemaItem>
//         ))
//         return (
//             <div className={"tableSchema_add"}>
//             <div className="wrapper">
//                 <div className="Title">태스크 데이터 테이블 스키마</div>
//                 <Link to="/admin/taskadd" className="right_side_small">뒤로가기</Link>
//                 <div className="formContent">
//                     <form className="input" onSubmit={onSubmit}>
//                         <input type={"text"} onChange={onChange} value={input}></input>
//                         <button type="submit">추가</button>
//                     </form>
//                     {schemaItemValues}
//                 </div>
//             </div>
//             </div>
//         );
//     }
// }
//
// export default Admin_tableSchema_add;

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


function Admin_tableSchema_add() {
    const [_list, setList] = useState<Value[]>( []);
    const [count, setCount] = useState<number>(1);
  const [_Value, setValue] = useState(defaultValue);
  // const [_list, setList] = useState()
  const pushButton = <P extends keyof tempValue>(prop:P, x : any) => setTempValue({..._tempValue, [prop] : x});
  const [_tempValue, setTempValue] = useState(defaultTempValue);
  const onValueChange =<P extends keyof tempValue> (prop: P, value: tempValue[P]) =>
  {
      setTempValue({..._tempValue, [prop]: value});
  }
  const handleSubmit = (e:any) =>{
      let content : Value ={
          id: count,
          datatypeName: _tempValue.name,
          datatypeType: _tempValue.type,
      };
      setCount(count + 1);
      let l : Value[] = Object.assign([], _list);
      l.push(content);
      setList(l);
      e.preventDefault();
  }
  const datatypeList = _list.map((item) => {
    return (
      <div key={item.datatypeName}>
          <li>
              <div className={"dataName"}>{item.datatypeName}</div>
              <div className={"dataType"}>{item.datatypeType}</div>
              <div><button className={"deleteButton"} onClick={e => handleRemove(item.id)}>[삭제하기]</button></div>
          </li>
      </div>
    );
  });
  const handleRemove = (id: number) => {
      let l : Value[] = [];
      _list.map((content) => {
          if(content.id !== id){
              l.push(content);
          }
      });
      setList(l);
  }

    const classes = useStyles();
    const [minUpload, setMinUpload] = React.useState<string | number>('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMinUpload(event.target.value as number);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


  return (
      <div className={"admin_tableSchema_add"}>
      <div className="wrapper">
          <div className={"Title"}>태스크 데이터 테이블 스키마</div>
            <Link to = "/admin/taskAdd" className="right_side_small">뒤로가기</Link>
          <div className="formContent">
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
                              onChange={handleChange}
                              style={{textAlign:'center'}}
                            >
                                <MenuItem value={"integer"} onClick={e => pushButton('type', 'integer')}>integer</MenuItem>
                                <MenuItem value={"string"} onClick={e => pushButton('type', 'string')}>string</MenuItem>
                                <MenuItem value={"float"} onClick={e => pushButton('type', 'float')}>float</MenuItem>
                                <MenuItem value={"boolean"} onClick={e => pushButton('type', 'boolean')}>boolean</MenuItem>
                            </Select>
                          </FormControl>
                       </div>

                      <form className="input" onSubmit={e => handleSubmit(e)}>
                          <button type="submit">추가</button>
                      </form>
                  </div>
              <div className={"alert"}>*속성 이름에는 특수문자를 사용할 수 없습니다.</div>
              <div className={"datatypeList"}><ul className={"decimalList"}>{datatypeList}</ul></div>
          </div>
        </div>
      </div>
  );
}
export default Admin_tableSchema_add;