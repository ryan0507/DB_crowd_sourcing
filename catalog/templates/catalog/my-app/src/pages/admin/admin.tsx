import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import admin_main from "./admin_main";
import admin_taskAdd from "./admin_taskAdd";
import admin_taskInfo from "./admin_taskInfo";
import admin_fileDetail from "./admin_fileDetail";
import admin_tableSchema_add from "./admin_tableSchema_add";
import admin_datatype_add from "./admin_datatype_add";
import admin_datatype_add_exist from "./admin_datatype_add_exist";
import admin_userList from "./admin_userLIst";
import admin_estimatorDetail from "./admin_estimatorDetail";
import admin_presenterDetail from "./admin_presenterDetail";
import admin_alterPassword from "./admin_alterPassword";
import "./admin.css";


function admin() {
  return (
      <Router>
        <div className="admin">
            <body>
                <div className="fixed-header">
                    <div className="container">
                        <nav>
                            <a className="n" href="/admin/main">태스크 관리</a>
                            <a className="n" href="/admin/userlist">회원 관리</a>
                            <a className="nr" href="/">Log out</a>
                            <a className="nr" href="/admin/alterpw">비밀번호 변경</a>
                        </nav>
                    </div>
                </div>
                <Switch><Route exact path="/" component={admin_main}/>
                    <Route exact={true} path="/admin/main" component={admin_main}/>
                    <Route exact path="/admin/taskadd" component={admin_taskAdd}/>
                    <Route exact path="/admin/taskinfo" component={admin_taskInfo}/>
                    <Route exact path="/admin/filedetail" component={admin_fileDetail}/>
                    <Route exact path="/admin/tableschemaadd" component={admin_tableSchema_add}/>
                    <Route exact path="/admin/datatypeadd" component={admin_datatype_add}/>
                    <Route exact path="/admin/datatypeadd_exist" component={admin_datatype_add_exist}/>
                    <Route exact path="/admin/userlist" component={admin_userList}/>
                    <Route exact path="/admin/estimatorDetail" component={admin_estimatorDetail}/>
                    <Route exact path="/admin/presenterDetail" component={admin_presenterDetail}/>
                    <Route exact path="/admin/alterpw" component={admin_alterPassword}/>
                </Switch>
            </body>
        </div>
      </Router>
  );
}

export default admin;
