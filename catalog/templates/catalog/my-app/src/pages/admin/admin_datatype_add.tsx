import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {Component, MouseEvent, useReducer, useState} from 'react';
import table from '../table';
import InputBase from "@material-ui/core/InputBase";

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

// type datatypeList = {
//     list: Value[];
// }
// const defaultDatatypeList: datatypeList = {
//     list: Value[];
// }

type tempValue = {
    name: string;
    type: string;
}

const defaultTempValue: tempValue ={
    name: '',
    type: '',
}

function Admin_datatype_add() {
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
            <div className={"dataType"}>({item.datatypeType})</div>
          </li>
      </div>
    );
  });
  return (
      <div className={"admin_datatype_add"}>
      <div className="wrapper">
          <div className={"Title"}>원본 데이터타입 추가</div>
            <Link to = "/admin/taskAdd" className="right_side_small">뒤로가기</Link>
          <div className="formContent">
                  <div className={"valueList"}>
                      <button className="valueName" onClick={e => pushButton('type', '음식점 이름')}>음식점 이름</button>
                      <button className="valueName" onClick={e => pushButton('type', '월 매출')}>월 매출</button>
                      <button className="valueName" onClick={e => pushButton('type','월 고객 수')}>월 고객 수</button>
                      <button className="valueName" onClick={e => pushButton('type','월 순이익')}>월 순이익</button>
                      <button className="valueName" onClick={e => pushButton('type','월 직원 수')}>월 직원 수</button>
                  </div>
                  <div className={"datatypeInput"}>
                        <div className={"small_lightgray_wrapper"}>{_tempValue.type}</div>
                        <InputBase
                          className={"datatypeName"}
                          placeholder="해당 원본 데이터 타입의 이름을 작성해주세요"
                          inputProps={{ 'aria-label': '원본 데이터 타입' }}
                          value={_tempValue.name}
                          onChange={e=> {
                              onValueChange('name', e.target.value)
                          }}
                        />
                      <form className="input" onSubmit={e => handleSubmit(e)}>
                          <button type="submit">추가</button>
                      </form>
                  </div>
              <div className={"datatypeList"}><ul className={"decimalList"}>{datatypeList}</ul></div>
          </div>
        </div>
      </div>
  );
}
export default Admin_datatype_add;