import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Link, Switch, NavLink, RouteComponentProps,} from 'react-router-dom';
import VueCookies from 'vue-cookies';
import './home.css';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

interface Ids{
    Id : string;
}
interface MainIds{
    MainId : string;
}
interface User{
    MainID: string;
    ID: string;
    Name : string;
}
interface NewUser{
    MainID : string;
    ID : string;
    Password : string;
    Name : string;
    Gender : string;
    Address : string;
    DateOfBirth : string;
    PhoneNumber : string;
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
    const [newBirth, setNewBirth] = useState(Date.parse('0001-01-01'));

    const [signIn, setSignIn] = useState(true);
    const initialUser = {
        MainID : "",
        ID : "",
        Password : "",
        Name : "",
        Gender : "",
        Address : "",
        DateOfBirth : '0001-01-01',
        PhoneNumber : "",
    }
    const [newUser, setNewUser] = useState<NewUser>(initialUser);

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
    const handleInputChange = <P extends keyof NewUser> (item : P, value: NewUser[P]) => {
        setNewUser({...newUser, [item] : value});
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
        setType('su');
    }
    const setRater = () => {
        setType('as');
    }
    const signUpAddress = (e:any) => {
        setNewAddress(e.target.value);
    }
    const signUpBirth = (e:any) => {
        setNewBirth(e.target.value);
    }
    const handleSignUp = (event : React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("signup");
        var exist = false;
        var max = -1;
        for(var i = 0; i<ids.length ; i++){
            if(ids[i].Id === newUser.ID){
                exist = true;
            }
        }
        for(var j = 0 ; j <mainIds.length ; j++){
            if(Number(mainIds[j].MainId.split(' ')[1]) > max){
                max = Number(mainIds[j].MainId.split(' ')[1]);
            }
        }
        var isnull = false;
        if(newUser.ID === "" || newUser.Password === "" || newUser.Name === "" || sex === '' || newUser.Address === "" || newUser.DateOfBirth === '0001-01-01' || newUser.PhoneNumber === "" || type === ''){
            isnull = true;
        }
        if(newUser.Password === newRePw && !exist && !isnull){
            axios.post('http://165.132.105.46:3025/homeUI/signup/', {
            MainID : type+' '+(max+1),
            ID : newUser.ID,
            Password : newUser.Password,
            Name : newUser.Name,
            Gender : sex,
            Address : newUser.Address,
            DateOfBirth : newUser.DateOfBirth,
            PhoneNumber : newUser.PhoneNumber,
        }).then((r) => {
            console.log(r);
            console.log(r.data);
            window.location.href="/"
        }).catch((err) => {
            alert("에러가 발생했습니다.")
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            window.location.href="/"} );


        }
        else if(isnull){
            alert("정보를 모두 입력해주세요.");
        }
        else if(newUser.Password !== newRePw){
            console.log("password error");
            alert("비밀번호가 같지 않습니다.");
        }
        else{
            console.log("id error");
            alert("이미 존재하는 ID 입니다.");
        }
    };
    const[ids, setIds] = useState<Ids[]>([]);
    const[mainIds, setMainIds] = useState<MainIds[]>([]);
    const getId = async() =>{
        await axios.get('http://165.132.105.46:3025/homeUI/id/').then((r)=>{
            let temp: Ids[] = r.data;
            setIds(temp);
        })
    }

    useEffect(()=>{
        getId()
    },[])

    const getMainId = async() =>{
        await axios.get('http://165.132.105.46:3025/homeUI/mainid/').then((r)=>{
            let temp: MainIds[] = r.data;
            setMainIds(temp);
        })
    }

    useEffect(()=>{
        getMainId()
    },[])

    function loginSuccess() {
        axios.post('http://165.132.105.46:3025/homeUI/login/', {
            ID: id,
            Password: pw
        }).then((r)=> {
            let user: User = r.data;
            console.log(user.MainID);
            if(user.MainID.includes('ad')){
                alert('안녕하세요 관리자 '+ user.Name+"(" + user.ID +")" +'님');
                window.location.replace('/admin/main');
            }
            else if(user.MainID.includes('su')){
                alert('안녕하세요 제출자 '+ user.Name+"(" + user.ID +")" +'님');
                window.location.replace('/submit/main');
            }
            else if(user.MainID.includes('as')){
                alert('안녕하세요 평가자 '+ user.Name+"(" + user.ID +")" +'님');
                window.location.replace('/rater/main');
            }
            else {
                alert('비회원');
            }
        })
    }


    return (
        <div className = 'home'>
            {signIn ? (
                <div className={"LoginTitle"}>Welcome!</div>
            ) : (<div></div>)}
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
                        <input type="text" className="signup__input1" onChange={e=> handleInputChange('ID', e.target.value)}></input>
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
                        <input type="text" className="signup__input1" onChange={e=> handleInputChange('Name', e.target.value)}></input>
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
                        <input type="text" className="signup__input1" onChange={e=> handleInputChange('Address', e.target.value)}></input>
                        <div className="signup-input__title">
                            Birth
                        </div>
                        <input type="date" className="select__birth" onChange={e=> handleInputChange('DateOfBirth', e.target.value)}></input>
                        <div className="signup-input__title">
                            Phone number
                        </div>
                        <div className="phone-number">
                            <input placeholder="- 생략하고 적어주세요."type="text" className="signup__input1" onChange={e=> handleInputChange('PhoneNumber', e.target.value)}></input>
                        </div>
                        <div className="type__select">
                            <div className={type==='su' ? "type-select1 blue" : "type-select1 white"} onClick={setSubmit} >제출자</div>
                            <div className={type==='as' ? "type-select2 blue" : "type-select2 white"} onClick={setRater}>평가자</div>
                        </div>
                        <div className="submit__button">
                            <Link to ="/">
                                <button type="submit" className="signup-submit" onClick={(event) => handleSignUp(event)}>회원가입</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Home_signInUp;