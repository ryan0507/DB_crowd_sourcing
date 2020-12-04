import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import './submit.css';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

interface Info {
    ID:string;
    Password:string;
    Name:string;
    Gender:string;
    Address:string;
    DateOfBirth:string;
    PhoneNumber:string;
}
interface state {
    "state": string;
    "message": string;
}
interface NewUser{
    BeforePw : string;
    ID : string;
    Password : string;
    Name : string;
    Gender : string;
    Address : string;
    DateOfBirth : string;
    PhoneNumber : string;
}




const Submit_changeInfo = ()=>{
    const [newId, setNewId] = useState('');
    const [beforePw, setbeforePw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newRePw, setNewRePw] = useState('');
    const [newName, setNewName] = useState('');
    const [sex, setSex] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [type, setType]= useState('');
    const [newBirth, setNewBirth] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const initialUser = {
        BeforePw : "",
        ID : "",
        Password : "",
        Name : "",
        Gender : "",
        Address : "",
        DateOfBirth : '0001-01-01',
        PhoneNumber : "",
    }
    const [newUser, setNewUser] = useState<NewUser>(initialUser);
    const handleInputChange = <P extends keyof NewUser> (item : P, value: NewUser[P]) => {
        setNewUser({...newUser, [item] : value});
    }

    const signUpID = (e:any) => {
        setNewId(e.target.value);
    }

    const signUpbeforePW = (e:any) => {
        setbeforePw(e.target.value);
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
        await axios.get('http://127.0.0.1:8000/submitUI/changeinfo').then((r)=>{
            let temp: Info = r.data;
            newUser.Address = temp.Address;
            newUser.ID = temp.ID;
            newUser.Name = temp.Name;
            newUser.Gender = temp.Gender;
            newUser.DateOfBirth = temp.DateOfBirth;
            newUser.PhoneNumber = temp.PhoneNumber;
            setSex(temp.Gender);
        })
    }

    useEffect(()=>{
        getApi()
    },[])



    function withdrawalSuccess() {
        axios.post('http://127.0.0.1:8000/homeUI/withdrawal/', {pw: newUser.BeforePw}
        ).then((r)=> {
            let user: state = r.data;
            if (user.state === "s") {
                alert(user.message);
                window.location.replace("/")
            }
            else if (user.state == "f1") {
                alert(user.message);
            }
            else  if (user.state == "f1") {
                alert(user.message);
                window.location.replace("/");
            }
        })
    }

    const ChangeInfo = (event : React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        var isnull = false;
        if( newUser.BeforePw === "" || newUser.ID === "" || newUser.Password === "" || newUser.Name === "" || sex === '' || newUser.Address === "" || newUser.DateOfBirth === '0001-01-01' || newUser.PhoneNumber === ""){
            isnull = true;
        }
        if(newUser.Password === newRePw && !isnull){
            axios.post('http://127.0.0.1:8000/homeUI/chif/', {
                BeforePW :newUser.BeforePw,
                ID : newUser.ID,
                Password : newUser.Password,
                Name : newUser.Name,
                Gender : sex,
                Address : newUser.Address,
                DateOfBirth : newUser.DateOfBirth,
                PhoneNumber : newUser.PhoneNumber
            }).then((r) => {
                // console.log(r.data);
                let user: state = r.data;
                if (user.state === "s" || user.state === "f3") {
                    alert(user.message);
                    window.location.replace("/")
                }
                else if (user.state === "f1" || user.state === "f2") {
                    alert(user.message);
                } else {
                    alert("Errors");
                }
            }).catch((err) => {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers); })
        }
        else if(isnull){
            alert("정보를 모두 입력해주세요.");
        }
        else if(newUser.Password !== newRePw){
            console.log("password error");
            alert("새로 입력된 비밀번호가 같지 않습니다.");
        }
        else{
            alert("Error");
        }
    };

    return (
        <div className = "Submit_changeInfo">
            <div className = 'wrapper'>
                <div className = 'home-white'>
                    <div className = "signup__select">
                        제출자 개인정보 수정
                    </div>
                    <div className='home__inputs'>
                        <div className={"signup-inputs"}>
                            <div className="signup-input__title">
                                ID
                            </div>
                            <input type="text" className="signup__input1" onChange={e=> handleInputChange('ID', e.target.value)} value={newUser.ID}></input>
                            <div className="signup-input__title">
                                Before Password
                            </div>
                            <input type="password" className="signup__input1" onChange={e=> handleInputChange('BeforePw', e.target.value)}></input>
                            <div className="signup-input__title">
                                Password
                            </div>
                            <input type="password" className="signup__input1" onChange={e=> handleInputChange('Password', e.target.value)}></input>
                            <div className="signup-input__title">
                                Repeat Password
                            </div>
                            <input type="password" className="signup__input1" onChange={signUpRePW} value={newRePw}></input>
                            <div className="signup-input__title">
                                Name
                            </div>
                            <input type="text" className="signup__input1" onChange={e=> handleInputChange('Name', e.target.value)} value={newUser.Name}></input>
                            <div className="signup-input__title">
                                Sex
                            </div>
                            <div className="signup__input2">
                                <div id='select__male' className={sex === 'M' ? "select__male blue" : "select__male white"} onClick={setMale}>Male</div>
                                <div id='select__female' className={sex === 'F' ? "select__female blue" : "select__female white"} onClick = {setFemale}>Female</div>
                            </div>
                            <div className="signup-input__title">
                                Address
                            </div>
                            <input type="text" className="signup__input1" onChange={e=> handleInputChange('Address', e.target.value)} value={newUser.Address}></input>
                            <div className="signup-input__title">
                                Birth
                            </div>
                            <input type="date" className="select__birth" onChange={e=> handleInputChange('DateOfBirth', e.target.value)} value={newUser.DateOfBirth}></input>
                            <div className="signup-input__title">
                                Phone number
                            </div>
                            <div className="phone-number">
                                <input placeholder="- 생략하고 적어주세요."type="text" className="signup__input1" onChange={e=> handleInputChange('PhoneNumber', e.target.value)} value = {newUser.PhoneNumber}></input>
                            </div>
                            <div className="submit__button_s">
                                <button className="signup-submit_s"  onClick={withdrawalSuccess}>탈퇴</button>
                                <button className="signup-submit_s" id="leftButton" onClick={(event) => ChangeInfo(event)}> 저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Submit_changeInfo;