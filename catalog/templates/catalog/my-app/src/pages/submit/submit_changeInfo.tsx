import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import './submit.css';

function Submit_changeInfo() {
  return (
      <div className = 'submit_changeInfo'>
          <div className = 'home-white'>
              <div className = "signup__select selected">
                  제출자 개인정보 수정
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
                      <div className="submit__button_s">
                          <Link to ="/submit/main">
                          <button className="signup-submit_s">수정하기</button></Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Submit_changeInfo;