import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
} from 'react-router-dom';
import admin_main from "./pages/admin_main";

function App() {
  return (
      <Router>
        <div className="App">
            <body>
                <div className="fixed-header">
                    <div className="container">
                        <nav>
                            <a className="n" href="/admin_main">태스크 관리</a>
                            <a className="nr" href="/">비밀번호 변경</a>
                            <a className="nr" href="/">회원 관리</a>
                        </nav>
                    </div>
                </div>
                <Switch>
                    <Route exact={true} path="/" component={admin_main}/>
                    <Route exact={true} path="/admin_main" component={admin_main}/>
                </Switch>
            </body>
        </div>
      </Router>
  );
}

export default App;
