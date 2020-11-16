import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';

import 'login.css';

function login() {
    const [signIn, SetSignIn] = useState(true);
    // const shiftInputSignin = () => {
    //     setSignIn(true);
    // }
    // const shiftInputSignup = () => {
    //     setSignIn(false);
    // }
  return (
      <div className = 'home'>
          {/*<div class = 'home-white'>*/}
          {/*    <div class = 'home-white__title'>*/}
          {/*        <span class = {signIn ? "signin__select selected" : "signin__select unselected"} onClick={shiftInputSignin}>SIGN IN</span>*/}
          {/*        <span class = {signIn ? "signup__select unselected" : "signup__select selected"} onClick={shiftInputSignup}>SIGN UP</span>*/}
          {/*    </div>*/}
          {/*    <div class='home__inputs'>*/}
          {/*        <div class={signIn ? "signin-inputs" : "signin-inputs hidden"}>*/}
          {/*            <div>*/}
          {/*                <input type="text" placeholder="ID" className="login__input-ID"></input>*/}
          {/*            </div>*/}
          {/*            <div>*/}
          {/*                <input type="text" placeholder="PASSWORD" className="login__input-PW"></input>*/}
          {/*            </div>*/}
          {/*            <div class="submit__button">*/}
          {/*                <button class="login-submit">LOG IN</button>*/}
          {/*            </div>*/}
          {/*        </div>*/}
          {/*        <div class={signIn ? "signup-inputs hidden" : "signup-inputs"}>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                ID*/}
          {/*            </div>*/}
          {/*            <input type="text" class="signup__input1"></input>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Password*/}
          {/*            </div>*/}
          {/*            <input type="text" class="signup__input1"></input>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Repeat Password*/}
          {/*            </div>*/}
          {/*            <input type="text" class="signup__input1"></input>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Name*/}
          {/*            </div>*/}
          {/*            <input type="text" class="signup__input1"></input>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Sex*/}
          {/*            </div>*/}
          {/*            <div class="signup__input2">*/}
          {/*                <div id='select__male' class="select__male white" onclick="clickMale()">Male</div>*/}
          {/*                <div id='select__female' class="select__female white" onclick="clickFemale()">Female</div>*/}
          {/*            </div>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Address*/}
          {/*            </div>*/}
          {/*            <input type="text" class="signup__input1"></input>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Birth*/}
          {/*            </div>*/}
          {/*            <input type="date" class="select__birth"></input>*/}
          {/*            <div class="signup-input__title">*/}
          {/*                Phone number*/}
          {/*            </div>*/}
          {/*            <div class="phone-number">*/}
          {/*                <input type="text" class="signup__input3"></input>*/}
          {/*                <span class="phone">-</span>*/}
          {/*                <input type="text" class="signup__input3"></input>*/}
          {/*                <span class="phone">-</span>*/}
          {/*                <input type="text" class="signup__input3"></input>*/}
          {/*            </div>*/}
          {/*            <div class="type__select">*/}
          {/*                <div id="type-select1" class="type-select1 white" onclick="clickType1()">제출자</div>*/}
          {/*                <div id="type-select2" class="type-select2 white" onclick="clickType2()">평가자</div>*/}
          {/*            </div>*/}
          {/*            <div class="submit__button">*/}
          {/*                <button class="login-submit">SIGN UP</button>*/}
          {/*            </div>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*</div>*/}
      </div>
  );
}

export default login;