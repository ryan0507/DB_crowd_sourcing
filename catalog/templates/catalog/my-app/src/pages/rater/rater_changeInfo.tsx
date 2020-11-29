import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import './rater.css';
import axios from "axios";

interface Info {
    ID:string;
    Password:string;
    Name:string;
    Gender:string;
    Address:string;
    DateOfBirth:string;
    PhoneNumber:string;
}


const Rater_changeInfo = ()=>{
    const [newId, setNewId] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newRePw, setNewRePw] = useState('');
    const [newName, setNewName] = useState('');
    const [sex, setSex] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [type, setType]= useState('');
    const [newBirth, setNewBirth] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const signUpID = (e:any) => {
        setNewId(e.target.value);
    }
    const signUpPW = (e:any) => {
        setNewPw(e.target.value);
    }
    const signUpRePW = (e:any) => {
        setNewRePw(e.target.value);
    }
    const signUpName = (e:any) => {
        setNewName(e.target.value);
    }
    const setMale = () => {
        setSex('M');
    }
    const setFemale = () => {
        setSex('F');
    }
    const setSubmit = () => {
        setType('s');
    }
    const setRater = () => {
        setType('r');
    }
    const signUpAddress = (e:any) => {
        setNewAddress(e.target.value);
    }
    const signUpBirth = (e:any) => {
        setNewBirth(e.target.value);
    }
    const signUpPhone = (e:any) => {
        setNewPhone(e.target.value);
    }

    const[info, setInfo] = useState<Info>({ ID:"Error", Password:"Error", Name:"Error", Gender: "M",
        Address : "Error", DateOfBirth:"Error", PhoneNumber:"Error"})

    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/raterUI/changeInfo').then((r)=>{
            let temp: Info = r.data;
            setNewId(temp.ID);
            setNewPw(temp.Password);
            setNewRePw(temp.Password);
            setNewName(temp.Name);
            setSex(temp.Gender);
            setNewAddress(temp.Address);
            setNewBirth(temp.DateOfBirth);
            setNewPhone(temp.PhoneNumber);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

    return (
        <div className = "Rater_changeInfo">
            <div className = 'wrapper'>
                <div className = 'home-white'>
                    <div className = "signup__select selected">
                        평가자 개인정보 수정
                    </div>
                    <div className='home__inputs'>
                        <div className={"signup-inputs"}>
                            <div className="signup-input__title">
                                ID
                            </div>
                            <input type="text" className="signup__input1" onChange={signUpID} value={newId}></input>
                            <div className="signup-input__title">
                                Password
                            </div>
                            <input type="password" className="signup__input1" onChange={signUpPW} value={newPw}></input>
                            <div className="signup-input__title">
                                Repeat Password
                            </div>
                            <input type="password" className="signup__input1" onChange={signUpRePW} value={newRePw}></input>
                            <div className="signup-input__title">
                                Name
                            </div>
                            <input type="text" className="signup__input1" onChange={signUpName} value={newName}></input>
                            <div className="signup-input__title">
                                Sex
                            </div>
                            <div className="signup__input2">
                                <div id='select__male' className={sex === 'M' ? "select__male blue" : "select__male white"} onClick={setMale} >Male</div>
                                <div id='select__female' className={sex === 'F' ? "select__female blue" : "select__female white"} onClick = {setFemale}>Female</div>
                            </div>
                            <div className="signup-input__title">
                                Address
                            </div>
                            <input type="text" className="signup__input1" onChange={signUpAddress} value={newAddress}></input>
                            <div className="signup-input__title">
                                Birth
                            </div>
                            <input type="date" className="select__birth" onChange={signUpBirth} value = {newBirth}></input>
                            <div className="signup-input__title">
                                Phone number
                            </div>
                            <div className="phone-number">
                                <input placeholder="- 생략하고 적어주세요."type="text" className="signup__input1"onChange={signUpPhone} value = {newPhone}></input>
                            </div>
                            <div className="submit__button_s">
                                <Link to ="/rater/main">
                                    <button className="signup-submit_s">수정하기</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rater_changeInfo;