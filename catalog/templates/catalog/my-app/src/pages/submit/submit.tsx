import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';
import submit_main from "./submit_main";
import submit_main2 from "./submit_main2";
import Submit_taskInfo from "./submit_taskInfo";
import Submit_taskInfo2 from "./submit_taskInfo2";
import Submit_taskCheck from "./submit_taskCheck";
import Submit_fileDetail from "./submit_fileDetail";
import Submit_submitFile from "./submit_submitFile";
import Submit_changeInfo from "./submit_changeInfo";

import "./submit.css";

type GreetingsProps = {
  name: string;
};

function submit({name}: GreetingsProps) {
  return (
      <Router>
            <body>
                <div className="fixed-header">
                    <div className="container">
                        <nav>
                            <a className="n" href="/submit/main">태스크 목록</a>
                            <a className="n" href="/submit/main2">참여중인 태스크</a>

                            <a className="nr" href="/">Log out</a>
                            <a className="nr" href="/submit/changeinfo">개인정보 수정</a>
                            <span className="nr" >안녕하세요 {name}님</span>
                        </nav>
                    </div>
                </div>
                <Switch>
                    <Route exact={true} path="/submit/main" component={submit_main}/>
                    <Route exact path="/submit/main2" component={submit_main2}/>
                    <Route exact path="/submit/taskinfo" component={Submit_taskInfo}/>
                    <Route exact path="/submit/taskinfo2" component={Submit_taskInfo2}/>
                    <Route exact path="/submit/taskcheck" component={Submit_taskCheck}/>
                    <Route exact path="/submit/filedetail" component={Submit_fileDetail}/>
                    <Route exact path="/submit/submitfile" component={Submit_submitFile}/>
                    <Route exact path="/submit/changeinfo" component={Submit_changeInfo}/>
                </Switch>
            </body>
      </Router>
  );
}

export default submit;

