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
import admin_taskAdd from "./pages/admin_taskAdd";
import admin_taskInfo from "./pages/admin_taskInfo";

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
                    <Route exact path="/" component={admin_main}/>
                    <Route exact={true} path="/admin_main" component={admin_main}/>
                    <Route exact path="/admin_taskAdd" component={admin_taskAdd}/>
                    <Route exact path="/admin_taskInfo" component={admin_taskInfo}/>
                </Switch>
            </body>
        </div>
      </Router>
  );
}

export default App;
