import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, { Fragment, useEffect, useState} from 'react';
import axios from "axios";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Admin_tableSchema_add from './admin_tableSchema_add';
import {FaceRounded} from "@material-ui/icons";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

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



//table schema add
interface Task{
    Name : string;
    Description : string;
    TaskThreshold : string;
    SubmissionPeriod : string;
    TableName : string;
    TableSchema : schema[];
    OriginData : originType[];
}
interface originType{
    name : string,
    schema : schema[];
}
interface schema{
    id : number,
    up: string,
    down : string,
}


interface dataTable {
    id: number,
    valueName: string;
    valueType: string;
}
type tempDataTable = {
    name: string;
    type: string;
}

const defaultTempDataTable: tempDataTable ={
    name: '',
    type: '',
}

//datatype Add
interface Type {
    id: number;
    originName: string;
    decidedName: string;
}
interface TypeList {
    name : string;
    types : Type[];
}
const defaultValue: Type = {
    id: 0,
    originName: '',
    decidedName: '',
}

type tempValue = {
    name: string;
    type: string;
}

const defaultTempValue: tempValue ={
    name: '',
    type: '',
}

function Admin_taskAdd(){
    const [valueList, setValueList] = useState<dataTable[]>( []);
    const [valueCount, setValueCount] = useState<number>(valueList.length + 1);

    const [toggleSchema, setToggleSchema] = useState<boolean>(true);
    const [toggleData, setToggleData] = useState<boolean>(true);
    const initialTask = {
        Name :"",
        Description : "",
        TaskThreshold : "",
        SubmissionPeriod : "",
        TableName : "",
        TableSchema : [],
        OriginData : [],
    }
    const [task, setTask] = useState<Task>(initialTask);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleTableNameChange = ( value: string) =>{
        let special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
          let korean_pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
          let Capital_pattern = /[A-Z]/;
          let number_pattern = /[0-9]/;
          if(!special_pattern.test(value) && !korean_pattern.test(value) && !Capital_pattern.test(value) && !number_pattern.test(value) && !value.includes(' ')) {
        setTask({...task, ["TableName"] : value});}
    }

    const handleInputChange =<P extends keyof Task> (item : P, value: Task[P]) =>{
        // if(item === "TableName" && value.includes(' ')){}
        // let isBlank : boolean = (value.search(/\s/) != -1);
        setTask({...task, [item] : value});
    }

    const handleToggleSchema = () => {
        setToggleSchema(!toggleSchema);
    }
    const handleToggleData = () => {
        setToggleData(!toggleData);
    }

    const handleTableSchemaTypeAdd = ( e: React.FormEvent<HTMLFormElement> ) => {
          e.preventDefault();
          let exist : boolean = false;
            valueList.map((item)=>{
                if(item.valueName === _tempDataTable.name){exist = true;}
            })

          if(!exist) {
              let content : dataTable ={
                  id: valueCount,
                  valueName: _tempDataTable.name,
                  valueType: _tempDataTable.type,
              };
              setValueCount(valueCount + 1);
              let l : dataTable[] = Object.assign([], valueList);
              l.push(content);

              let temp : schema[] = Object.assign([], task.TableSchema);
              temp.push({id : valueCount, up : _tempDataTable.name, down: _tempDataTable.type});

              console.log(temp);
              setTask({...task, ["TableSchema"] : temp})
              console.log(task);
              setValueList(l);
          }else{alert('이미 존재하는 데이터 테이블 스키마 속성 이름입니다.')}

    }

    const onSchemaChange = <P extends keyof tempDataTable> (prop: P, value: tempDataTable[P]) => {
          setTempDataTable({..._tempDataTable, [prop]: value});
      }

    const schemaList = valueList.map((item) => {
        return (
          <div key={item.valueName}>
              <li>
                  <div className={"dataName"}>{item.valueName}</div>
                  <div className={"dataType"}>{item.valueType}</div>
                  <div><button className={"deleteButton"} onClick={e => handleValueRemove(item.id)}>[삭제하기]</button></div>
              </li>
          </div>
        );
      });

    const handleValueRemove = (id: number) => {
      let l : dataTable[] = [];
      valueList.map((content) => {
          if(content.id !== id){
              l.push(content);
          }
      });
      let temp : schema[] = [];
      task.TableSchema.map((item)=>{
          if(item.id !== id){
              temp.push(item);
          }
      })
      setTask({...task, ["TableSchema"] : temp})
      setValueList(l);
    }
    const [_tempDataTable, setTempDataTable] = useState(defaultTempDataTable);

    //datatype add
    const [dataTypeList, setDataTypeList] = useState<TypeList[]>([]);
    const [_list, setList] = useState<Type[]>( []);
    const [_name, setName] = useState<string>("");
    const [typeCount, setTypeCount] = useState<number>(dataTypeList.length+1);
    const [count, setCount] = useState<number>(1);
      const [_Value, setValue] = useState(defaultValue);
      // const [_list, setList] = useState()
      const pushButton = <P extends keyof tempValue>(prop:P, x : any) => setTempValue({..._tempValue, [prop] : x});
      const [_tempValue, setTempValue] = useState(defaultTempValue);
      const onValueChange =<P extends keyof tempValue> (prop: P, value: tempValue[P]) =>
      {
          let special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
          let Capital_pattern = /[A-Z]/;
          let number_pattern = /[0-9]/;
          if(!special_pattern.test(value) && !Capital_pattern.test(value) && !number_pattern.test(value) && !value.includes(' ')) {

              setTempValue({..._tempValue, [prop]: value});
          }
      }
      const onTypeNameChange = (value : string) =>{
          let special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
          let Capital_pattern = /[A-Z]/;
          let number_pattern = /[0-9]/;
          if(!special_pattern.test(value) &&  !Capital_pattern.test(value) && !number_pattern.test(value) && !value.includes(' ')) {

              setName(value);
          }
      }
      const handleSubmit = (e:any) =>{
          e.preventDefault();
          let exist : boolean = false;
          let isName : boolean = true;
          let existName : boolean = false;
            _list.map((item)=>{
                if(item.originName === _tempValue.type){exist = true;}
                if(item.decidedName === _tempValue.name){existName = true;}
            })
          if(_tempValue.name === ''){isName= false;}

          if(!exist && !existName && isName) {
              let content: Type = {
                  id: count,
                  originName: _tempValue.type,
                  decidedName: _tempValue.name,
              };
              setCount(count + 1);
              let l: Type[] = Object.assign([], _list);
              l.push(content);
              setList(l);
          }else if(existName){
              alert("이미 존재하는 원본 데이터 타입 속성 이름입니다.")
          }else if(!isName){
              alert("해당 원본 데이터 타입 속성의 이름을 지정해주세요.")
          } else(alert("이미 선택한 태스크 데이터 테이블 속성입니다."))
      }
      const datatypeList = _list.map((item) => {
        return (
          <div className={"decimalDatatypeList"} key={item.originName}>
              <li>
                  <div className={"dataName"}>{item.decidedName}</div>
                  <div className={"dataType"}>{item.originName}</div>
                  <div><button className={"deleteButton"} onClick={e => handleRemove(item.id)}>[삭제하기]</button></div>
              </li>
          </div>
        );
      });
      const handleRemove = (id: number) => {
          let l : Type[] = [];
          _list.map((content) => {
              if(content.id !== id){
                  l.push(content);
              }
          });
          setList(l);
      }
      const handleTypeRemove = (name: string) => {
          let l : TypeList[] = [];
          dataTypeList.map((content) => {
              if(content.name !== name){
                  l.push(content);
              }
          });
          setDataTypeList(l);

          let temp : originType[] = [];
          task.OriginData.map((item)=>{
              if(item.name !== name){
                  temp.push(item);
              }
          })
          setTask({...task, ["OriginData"] : temp})


        }
    const handleTypeSubmit = (e:any) => {
          e.preventDefault();
        let exist: boolean = false;
        let isName: boolean = true;
        task.OriginData.map((item) => {
            if (item.name === _name) {
                exist = true;
            }
        })
        if(_name === ''){isName=false;}

        if (!exist && isName) {
            let content: TypeList = {
                name: _name,
                types: _list,
            };
            setTypeCount(typeCount + 1);
            let l: TypeList[] = Object.assign([], dataTypeList);
            l.push(content);
            setDataTypeList(l);


            //
            let temp: schema[] = [];
            _list.map((item) => {
                let k: schema = {id: 0, up: '', down: ''};
                k.id = item.id;
                k.up = item.decidedName;
                k.down = item.originName;
                temp.push(k);
            })
            // temp.push({id : valueCount, up : _tempDataTable.name, down: _tempDataTable.type});

            let tempOrigin: originType[] = Object.assign([], task.OriginData);
            tempOrigin.push({name: _name, schema: temp});

            console.log(tempOrigin);
            setTask({...task, ["OriginData"]: tempOrigin});
            console.log(task);

            setList([]);
            setCount(1);
        }else if(exist){alert("이미 존재하는 원본 데이터 타입 이름입니다.")}else{alert("원본 데이 타입의 이름을 지정해주세요.")}
    }

    const handleSubmitDD = ( event : React.FormEvent<HTMLFormElement> ) =>{
          event.preventDefault();
          let exAll : boolean = true;
          if( task.Name === '' || task.Description==='' || task.TaskThreshold === ''
           || task.TableName === '' || task.TableSchema.length === 0 || task.OriginData.length === 0){exAll = false;}
          console.log(task.TableSchema);
          console.log(task.OriginData);
        if(exAll) {
            axios.post('http://127.0.0.1:8000/adminUI/create/', {
                Name: task.Name,
                Description: task.Description,
                TaskThreshold: task.TaskThreshold,
                SubmissionPeriod: task.SubmissionPeriod,
                TableName: task.TableName,
                TableSchema: task.TableSchema,
                OriginData: task.OriginData,
            }).then((r) => {
                console.log(r);
                console.log(r.data);
                console.log('hhhhhhhhhhhhhhhh');
                window.location.href = "/admin/main/";
            }).catch((err) => {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            })
        }else{alert("모든 정보를 입력해주시길 바랍니다.")}

        // const taskName = {event.target.name}
        // setTask({e.target.name.task_name, 0, '', '', '', ''}) ;
        // {_TaskID: {e.target.elements.task_name},
        // _SubmissionPeriod : {e.target}
        // _TableName ,
        // _TaskSchema,
        // _Name,
        // _Description};
    };

   return(
       <div className={"taskAdd"}>
       <div className="wrapper">
           <div className="Title">태스크 추가</div>
           <Link to = "/admin/main" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"task_name"}>
                   <div className={"wrapper_title"}>태스크 이름</div>
                       <InputBase
                           name={"taskID"}
                            className={"nameTask"}
                            placeholder="태스크 이름을 작성해주세요."
                            inputProps={{ 'aria-label': '태스크 이름' }}
                            onChange={e=> handleInputChange('Name', e.target.value)}
                          />
               </div>

               <div className={"task_info"}>
                   <div className={"wrapper_title"}>태스크 설명</div>
                       <InputBase
                            className={"aboutTask"}
                            placeholder="태스크에 관한 설명을 작성해주세요."
                            inputProps={{ 'aria-label': '태스크 설명' }}
                           onChange={e=> handleInputChange('Description', e.target.value)}
                          />
               </div>

               <div className={"task_howToPass"}>
                   <div className={"wrapper_title"}>태스크 PASS 기준</div>
                   <InputBase
                            className={"howToTask"}
                            placeholder="태스크의 파일 제출 통과 기준을 작성해주세요."
                            inputProps={{ 'aria-label': '통과 기준 설명' }}
                            onChange={e=> handleInputChange('TaskThreshold', e.target.value)}
                          />
               </div>

               <div className={"minUpload"}>
                   <div className={"wrapper_title"}>최소 업로드 주기</div>
                   <div className={"dropdown"}>
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={open}
                          onClose={handleClose}
                          onOpen={handleOpen}
                          value={task.SubmissionPeriod}
                          onChange={e=> handleInputChange('SubmissionPeriod', (e.target.value as string))}
                          style={{textAlign:'center'}}
                        >
                          <MenuItem value="">
                            <em>선택 안 함</em>
                          </MenuItem>
                          <MenuItem value={"10"}>10일</MenuItem>
                          <MenuItem value={"20"}>20일</MenuItem>
                          <MenuItem value={"30"}>30일</MenuItem>
                          <MenuItem value={"40"}>40일</MenuItem>
                          <MenuItem value={"50"}>50일</MenuItem>
                          <MenuItem value={"60"}>60일</MenuItem>
                          <MenuItem value={"70"}>70일</MenuItem>
                          <MenuItem value={"80"}>80일</MenuItem>
                          <MenuItem value={"90"}>90일</MenuItem>
                          <MenuItem value={"100"}>100일</MenuItem>
                        </Select>
                      </FormControl>
                   </div>
               </div>
               <div className={"Description"}>
                   <div className={"descriptionTitle"}>데이터 테이블 및 원본 데이터 타입 생성 방법</div>
                   <div className={"descriptionBody"}>
                       <div className={"bodyTitle"}>[데이터 테이블 추가 방법] </div>
                       1. 데이터 테이블의 이름 작성 <br/>
                       2. '태스크 데이터 테이블 스키마 수정' 버튼 클릭 <br/>
                       3. 추가하고 싶은 속성의 타입과 이름 지정하여 추가 <br/>
                       4. 모든 속성을 추가했다면 우측 상단의 '태스크 데이터 테이블 스키마 저장' 버튼 클릭 <br/><br/>
                       <div className={"bodyTitle"}>[원본 데이터 타입 추가 방법] </div>
                       1. '원본 데이터 타입 추가' 버튼 클릭 <br/>
                       2. 원본 데이터 타입의 이름 작성<br/>
                       3. 알맞은 데이터 테이블의 속성 선택 후 속성의 이름 지정하여 추가 <br/>
                       4. 모든 속성을 추가했다면 '원본 데이터타입 추가' 버튼 클릭 <br/>
                       5. 원하는 원본 데이터 타입을 모두 추가했다면 우측 상단의 '원본 데이터 타입 저장' 버튼 클릭
                   </div>
               </div>

               <div className={"dataTable_name"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                       <InputBase
                          className={"nameDataTable"}
                        placeholder="태스크 데이터 테이블의 이름을 작성해주세요."
                        inputProps={{ 'aria-label': '데이터 테이블 이름' }}
                          value={task.TableName}
                          onChange={e=> handleTableNameChange(e.target.value)}
                          />
                          <div className={"notice2"}>*테이블 이름에는 영어 소문자만을 사용할 수 있습니다.</div>
               </div>

               <div className={"dataTableSchema"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                   <button className={"addDataTypeButton"} onClick={handleToggleSchema}>
                       {toggleSchema ? (<Fragment >태스크 데이터 테이블 스키마 수정</Fragment>) : (<Fragment>태스크 데이터 테이블 스키마 저장</Fragment>)}
                   </button>
                   {toggleSchema ? (
                       <ul className={"dataTableSchema_list"}>
                           {valueList.map((item) =>{
                                return(<li>{item.valueName}
                                   <div className={"valueType"}>{item.valueType}</div>
                               </li>)
                           })}
                       </ul>
                   ) : (
                       <div className={"editDatatypeList"}>
                           <div className={"datatypeList"}><ul className={"decimalList"}>{schemaList}</ul></div>
                           <Admin_tableSchema_add onSchemaChange={onSchemaChange}/>
                          <form className="input" onClick={(e)  => handleTableSchemaTypeAdd(e)}>
                              <button type={"submit"}>추가</button>
                          </form>
                        </div>
                   )}
               </div>

               <div className={"originDataType_add"}>
                   <div className={"wrapper_title"}>원본 데이터 타입</div>
                   <button className={"addDataTypeButton"} onClick={handleToggleData}>
                       {toggleData ? (<Fragment>원본 데이터 타입 추가</Fragment>) : (<Fragment>원본 데이터 타입 저장</Fragment>)}
                   </button>
                   {toggleData ? (
                       <ul className={"datatype_list"}>
                           {task.OriginData.map((item) =>{
                               return(
                                   <li className={"dataVertical"}>
                                       <div className={"datatypeID"}>[{item.name}] :</div>
                                        <ul className={"value_list"}>
                                       {item.schema.map((type) =>{
                                           return(
                                               <li>
                                                   <div className={"decidedName"}>{type.up}</div>
                                                   <div className={"originName"}>{type.down}</div>
                                               </li>);
                                       })}
                                        </ul>
                                   </li>);
                           })}
                   </ul>
                   ) : (
                       <div className={"admin_datatype_add"}>

                           <ul className={"datatype_list"}>
                               {task.OriginData.map((item) =>{
                                   return(
                                       <li className={"dataVertical"}>
                                           <div className={"datatypeID"}>[{item.name}] : </div>
                                           {item.schema.map((type) =>{
                                               return(
                                                <ul className={"value_list"}>
                                                   <li>
                                                       <div className={"decidedName"}>{type.up}</div>
                                                       <div className={"originName"}>{type.down}</div>
                                                   </li>
                                                </ul>);
                                           })}
                                           <div><button className={"deleteButton"} onClick={e => handleTypeRemove(item.name)}>[삭제하기]</button></div>
                                       </li>
                                   );
                               })}
                            </ul>
                           <div className={"datatypeName"}>
                               <div className={"typeNameWord"}>원본 데이터 타입 이름 :</div>
                               <InputBase
                                  className={"datatypeNameInput"}
                                  placeholder="해당 원본 데이터 타입의 이름을 작성해주세요"
                                  inputProps={{ 'aria-label': '원본 데이터 타입' }}
                                  value={_name}
                                  onChange={e=> {
                                      onTypeNameChange(e.target.value)
                                  }}
                                />
                           </div>
                                <div className={"notice1"}>*데이터 타입 이름에는 영어 소문자와 한글만을 사용할 수 있습니다.</div>

                           <div className={"valueList"}>
                               {valueList.map((item)=>{
                                   return(<button className="valueName" onClick={e => pushButton('type', item.valueName)}>{item.valueName}</button>);
                               })}
                          </div>
                          <div className={"datatypeInput"}>
                                <div className={"small_lightgray_wrapper"}>{_tempValue.type}</div>
                                <InputBase
                                  className={"datatypeValueName"}
                                  placeholder="해당 원본 데이터 타입 속성 이름을 작성해주세요."
                                  inputProps={{ 'aria-label': '원본 데이터 타입' }}
                                  value={_tempValue.name}
                                  onChange={e=> {
                                      onValueChange('name', e.target.value)
                                  }}
                                />
                                <div className={"notice1"}>*속성 이름에는 영어 소문자와 한글만을 사용할 수 있습니다.</div>
                              <form className="input" onClick={e => handleSubmit(e)}>
                                  <button className={"short"} type="submit">추가</button>
                              </form>
                          </div>
                           <div className={"datatypeList"}><ul className={"decimalList"}>{datatypeList}</ul></div>
                           {_list.length >= 1 ?(
                               <form className="input1" onClick={e => handleTypeSubmit(e)}>
                                  <button className={"long"} type="submit">원본 데이터타입 추가</button>
                              </form>
                           ):(<div></div>)}

                       </div>
                   )}
                   {/*<Link className={"addDataType"} to = "/admin/datatypeadd">원본 데이터 타입 추가하기</Link>*/}

               </div>
               <form onSubmit={(event) => handleSubmitDD(event)}>
                   <input type="submit" value="제출"/>
               </form>
           </div>
       </div>
       </div>
   );
}

export default Admin_taskAdd;