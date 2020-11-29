import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';

import rater_changeInfo from "./rater_changeInfo";
import Rater_main from "./rater_main";
import Rater_main2 from "./rater_main2";
import Rater_fileDetail from "./rater_fileDetail";
import Rater_taskDetail from "./rater_taskDetail";

import "./rater.css";

function rater() {
  return (
      <Router>
        <div className="admin">
            <body>
                <div className="fixed-header">
                    <div className="container">
                        <nav>
                            <a className="n" href="/rater/main">할당된 파일 목록</a>
                            <a className="n" href="/rater/main2">평가 내역</a>

                            <a className="nr" href="/">Log out</a>
                            <a className="nr" href="/rater/changeInfo">개인정보 수정</a>
                        </nav>
                    </div>
                </div>
                <Switch>
                    <Route exact={true} path="/rater/main" component={Rater_main}/>
                    <Route exact path="/rater/main2" component={Rater_main2}/>
                    <Route exact path="/rater/changeInfo" component={rater_changeInfo}/>
                    <Route exact path="/rater/fileDetail" component={Rater_fileDetail}/>
                    <Route exact path="/rater/taskDetail/:submission_id" component={Rater_taskDetail}/>
                </Switch>
            </body>
        </div>
      </Router>
  );
}

export default rater;
