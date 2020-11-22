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

import submit from './pages/submit/submit';
import submit_main from './pages/submit/submit_main';
import submit_main2 from './pages/submit/submit_main2';
import submit_taskInfo from "./pages/submit/submit_taskInfo";
import submit_taskInfo2 from "./pages/submit/submit_taskInfo2";
import submit_taskCheck from "./pages/submit/submit_taskCheck";
import submit_fileDetail from "./pages/submit/submit_fileDetail";
import submit_changeInfo from "./pages/submit/submit_changeInfo";

import rater from './pages/rater/rater';
import rater_main from "./pages/rater/rater_main";
import rater_main2 from "./pages/rater/rater_main2";
import rater_changeInfo from "./pages/rater/rater_changeInfo";
import rater_fileDetail from "./pages/rater/rater_fileDetail";
import rater_taskDetail from "./pages/rater/rater_taskDetail";

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

                    <Route exact path="/submit/main" component={submit}/>
                    <Route exact path="/submit/main2" component={submit}/>
                    <Route exact path="/submit/taskinfo" component={submit}/>
                    <Route exact path="/submit/taskinfo2" component={submit}/>
                    <Route exact path="/submit/taskCheck" component={submit}/>
                    <Route exact path="/submit/filedetail" component={submit}/>
                    <Route exact path="/submit/submitfile" component={submit}/>
                    <Route exact path="/submit/changeinfo" component={submit}/>

                    <Route exact path="/rater/main" component={rater}/>
                    <Route exact path="/rater/main2" component={rater}/>
                    <Route exact path="/rater/changeInfo" component={rater}/>
                    <Route exact path="/rater/fileDetail" component={rater}/>
                    <Route exact path="/rater/taskDetail" component={rater}/>

                </Switch>
            </Router>
  );
}

export default App;
