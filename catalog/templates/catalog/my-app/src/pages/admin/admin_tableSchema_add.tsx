import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import TableSchemaItem from './tableSchemaItem';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

interface Props{}

interface TableSchema {
    id: number;
    valueName: string;
    valueType: string;
};

interface State{
    type: string;
    input: string;
    schemaValues: TableSchema[];
}

class Admin_tableSchema_add extends React.Component<Props, State> {

    _id: number = 0;
    state: State= {
        type: "",
        input: "",
        schemaValues: [],
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) : void => {
        const { value } = e.currentTarget;
        this.setState({
            input: value,
        })
    }

    onClick = (e: React.FormEvent<HTMLInputElement>) : void => {
        const { value } = e.currentTarget;
        this.setState({
            type: value,
        })
    }

    onSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();
        this.setState(({ schemaValues, input, type }) => ({
            type: "",
            input: "",
            schemaValues: schemaValues.concat({
                id: this._id++,
                valueName: input,
                valueType: type,
            }),
        }))
    }
    onRemove = (_id: number): void =>{
        this.setState(({ schemaValues })=> ({
            schemaValues: schemaValues.filter((_value)=> _value.id !== _id),
        }))
    }

    onUpdate=():void =>{}
    render() {
        const {onSubmit, onChange, onRemove, onUpdate} = this
        const {input, schemaValues} = this.state

        const schemaItemValues = schemaValues.map((_value) => (
            <TableSchemaItem
                onRemove={() => onRemove(_value.id)}
                valueName={_value.valueName}
                valueType={_value.valueType}
                onUpdate={() => onUpdate()}
            ></TableSchemaItem>
        ))
        return (
            <div className={"tableSchema_add"}>
            <div className="wrapper">
                <div className="Title">태스크 데이터 테이블 스키마</div>
                <Link to="/admin/taskadd" className="right_side_small">뒤로가기</Link>
                <div className="formContent">
                    <form className="input" onSubmit={onSubmit}>
                        <input type={"text"} onChange={onChange} value={input}></input>
                        <button type="submit">추가</button>
                    </form>
                    {schemaItemValues}
                </div>
            </div>
            </div>
        );
    }
}

export default Admin_tableSchema_add;