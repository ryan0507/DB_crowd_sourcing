import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import VueCookies from 'vue-cookies';
import './home.css';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true


interface User{
    MainID: string;
    ID: string;
    Name : string;
}

function Home_signInUp() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const [newId, setNewId] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newRePw, setNewRePw] = useState('');
    const [newName, setNewName] = useState('');
    const [sex, setSex] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [type, setType]= useState('');
    const [newBirth, setNewBirth] = useState('');

    const [signIn, setSignIn] = useState(true);


    const shiftInputSignin = () => {
        setSignIn(true);
    }
    const shiftInputSignup = () => {
        setSignIn(false);
    }
    const onChangeID = (e:any) => {
        setId(e.target.value);
    }
    const onChangePW = (e:any) => {
        setPw(e.target.value);
    }
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


    function loginSuccess() {
        axios.post('http://127.0.0.1:8000/homeUI/login/', {
            ID: id,
            Password: pw
        }).then((r)=> {
            let user: User = r.data;
            if(user.MainID.includes('ad')){
                alert('관리자');
                window.location.replace('/admin/main');
            }
            else if(user.MainID.includes('su')){
                alert('제출자');
                window.location.replace('/submit/main');
            }
            else if(user.MainID.includes('as')){
                alert('평가자');
                window.location.replace('/rater/main');
            }
            else {
                alert('비회원');
            }

        })
    }


    return (
        <div className = 'home'>
            <div className = 'home-white'>
                <div className = 'home-white__title'>
                    <span className = {signIn ? "signin__select selected" : "signin__select unselected"} onClick={shiftInputSignin}>SIGN IN</span>
                    <span className = {signIn ? "signup__select unselected" : "signup__select selected"} onClick={shiftInputSignup}>SIGN UP</span>
                </div>
                <div className='home__inputs'>
                    <div className={signIn ? "signin-inputs" : "signin-inputs hidden"}>
                        <div>
                            <input type="text" placeholder="ID" className="login__input-ID" value={id} onChange={onChangeID}></input>
                        </div>
                        <div>
                            <input type="password" placeholder="PASSWORD" className="login__input-PW" value={pw} onChange={onChangePW}></input>
                        </div>
                        <div className="submit__button">
                            <button className="login-submit" onClick={loginSuccess}>LOG IN</button>
                        </div>

                    </div>
                    <div className={signIn ? "signup-inputs hidden" : "signup-inputs"}>
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
                        <input type="date" className="select__birth" onChange={signUpBirth}></input>
                        <div className="signup-input__title">
                            Phone number
                        </div>
                        <div className="phone-number">
                            <input placeholder="- 생략하고 적어주세요."type="text" className="signup__input1"></input>
                        </div>
                        <div className="type__select">
                            <div className={type==='s' ? "type-select1 blue" : "type-select1 white"} onClick={setSubmit} >제출자</div>
                            <div className={type==='r' ? "type-select2 blue" : "type-select2 white"} onClick={setRater}>평가자</div>
                        </div>
                        <div className="submit__button">
                            <Link to ="/">
                                <button className="signup-submit">SIGN UP</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Home_signInUp;