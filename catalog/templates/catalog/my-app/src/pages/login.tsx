import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';

function login() {
  return (
    <div className="wrapper">
      <div className="formContent_signin">
        <h2 className="active"> Sign In </h2>
        <h2 className="inactive underlineHover">Sign Up </h2>

        <div className="sign">
            <input type="text" id="login" name="login" placeholder="login"></input>
            <input type="text" id="password" name="login" placeholder="password"></input>
            <input type="submit" value="Log In"></input>
        </div>
      </div>
    </div>
  );
}

export default login;