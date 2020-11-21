import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import '../home/home.css';

function Submit_changeInfo() {
  return (
      <div className = 'home'>
          <div className = 'home-white'>
              <div className = "signup__select selected">
                  개인정보 수정
              </div>
              <div className='home__inputs'>
                  <div className={"signup-inputs"}>
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
                      </div>
                      <div className="submit__button">
                          <Link to ="/">
                          <button className="signup-submit">수정하기</button></Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Submit_changeInfo;