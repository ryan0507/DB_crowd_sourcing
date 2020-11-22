import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';

import './home.css';

function Home_signInUp() {
    const [signIn, setSignIn] = useState(true);
     const shiftInputSignin = () => {
         setSignIn(true);
     }
     const shiftInputSignup = () => {
         setSignIn(false);
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
                          <input type="text" placeholder="ID" className="login__input-ID"></input>
                      </div>
                      <div>
                          <input type="text" placeholder="PASSWORD" className="login__input-PW"></input>
                      </div>
                      <div className="submit__button">
                          <Link to ="/admin/main">
                          <button className="login-submit">LOG IN</button></Link>
                      </div>
                      <div className="submit__button">
                          <Link to ="/submit/main">
                          <button className="login-submit">임시 제출자 연결</button></Link>
                      </div>
                      <div className="submit__button">
                          <Link to ="/rater/main">
                          <button className="login-submit">임시 평가자 연결</button></Link>
                      </div>

                  </div>
                  <div className={signIn ? "signup-inputs hidden" : "signup-inputs"}>
                      <div className="signup-input__title">
                          ID
                      </div>
                      <input type="text" className="signup__input1"></input>
                      <div className="signup-input__title">
                          Password
                      </div>
                      <input type="text" className="signup__input1"></input>
                      <div className="signup-input__title">
                          Repeat Password
                      </div>
                      <input type="text" className="signup__input1"></input>
                      <div className="signup-input__title">
                          Name
                      </div>
                      <input type="text" className="signup__input1"></input>
                      <div className="signup-input__title">
                          Sex
                      </div>
                      <div className="signup__input2">
                          <div id='select__male' className="select__male white" >Male</div>
                          <div id='select__female' className="select__female white" >Female</div>
                      </div>
                      <div className="signup-input__title">
                          Address
                      </div>
                      <input type="text" className="signup__input1"></input>
                      <div className="signup-input__title">
                          Birth
                      </div>
                      <input type="date" className="select__birth"></input>
                      <div className="signup-input__title">
                          Phone number
                      </div>
                      <div className="phone-number">
                          <input type="number" className="signup__input3"></input>
                          <span className="phone">-</span>
                          <input type="number" className="signup__input3"></input>
                          <span className="phone">-</span>
                          <input type="number" className="signup__input3"></input>
                      </div>
                      <div className="type__select">
                          <div className="type-select1 white" >제출자</div>
                          <div className="type-select2 white" >평가자</div>
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