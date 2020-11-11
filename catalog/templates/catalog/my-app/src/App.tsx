import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
} from 'react-router-dom';
import admin_main from "./pages/admin/admin_main";
import admin_taskAdd from "./pages/admin/admin_taskAdd";
import admin_taskInfo from "./pages/admin/admin_taskInfo";
import admin_tableSchema_add from "./pages/admin/admin_tableSchema_add";
import admin_datatype_add from "./pages/admin/admin_datatype_add";
import admin_taskOrigin from "./pages/admin/admin_taskOrigin";
import table from "./pages/admin/table";

function App() {
  return (
      <Router>
        <div className="App">
            <body>
                <div className="fixed-header">
                    <div className="container">
                        <nav>
                            <a className="n" href="/admin/main">태스크 관리</a>
                            <a className="nr" href="/">비밀번호 변경</a>
                            <a className="nr" href="/">회원 관리</a>
                        </nav>
                    </div>
                </div>
                <Switch>
                    <Route exact path="/" component={admin_main}/>
                    <Route exact={true} path="/admin/main" component={admin_main}/>
                    <Route exact path="/admin/taskadd" component={admin_taskAdd}/>
                    <Route exact path="/admin/taskinfo" component={admin_taskInfo}/>
                    <Route exact path="/admin/tableschemaadd" component={admin_tableSchema_add}/>
                    <Route exact path="/admin/datatypeadd" component={admin_datatype_add}/>
                    <Route exact path="/admin/table" component={table}/>
                </Switch>
            </body>
        </div>
      </Router>
  );
}

export default App;
