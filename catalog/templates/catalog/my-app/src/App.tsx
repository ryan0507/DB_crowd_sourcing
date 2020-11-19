import React from 'react';
import './App.css';
import "./pages/admin/admin.css";
import './pages/home/home.css';
import admin from './pages/admin/admin';
import home_signInUp from './pages/home/home_signInUp';
import admin_main from "./pages/admin/admin_main";
import admin_taskAdd from "./pages/admin/admin_taskAdd";
import admin_taskInfo from "./pages/admin/admin_taskInfo";
import admin_fileDetail from "./pages/admin/admin_fileDetail";
import admin_tableSchema_add from "./pages/admin/admin_tableSchema_add";
import admin_datatype_add from "./pages/admin/admin_datatype_add";
import admin_datatype_add_exist from "./pages/admin/admin_datatype_add_exist";
import admin_userList from "./pages/admin/admin_userLIst";
import admin_estimatorDetail from "./pages/admin/admin_estimatorDetail";
import admin_presenterDetail from "./pages/admin/admin_presenterDetail";
import admin_alterPassword from "./pages/admin/admin_alterPassword";
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';


function App() {
  return (
            <Router>
                <Switch>
                    <Route exact={true} path="/" component={home_signInUp}/>
                    <Route exact path="/admin/main" component={admin}/>
                    <Route exact path="/admin/taskadd" component={admin}/>
                    <Route exact path="/admin/taskinfo" component={admin}/>
                    <Route exact path="/admin/filedetail" component={admin}/>
                    <Route exact path="/admin/tableschemaadd" component={admin}/>
                    <Route exact path="/admin/datatypeadd" component={admin}/>
                    <Route exact path="/admin/datatypeadd_exist" component={admin}/>
                    <Route exact path="/admin/userlist" component={admin}/>
                    <Route exact path="/admin/estimatorDetail" component={admin}/>
                    <Route exact path="/admin/presenterDetail" component={admin}/>
                    <Route exact path="/admin/alterpw" component={admin}/>
                </Switch>
            </Router>
  );
}

export default App;
