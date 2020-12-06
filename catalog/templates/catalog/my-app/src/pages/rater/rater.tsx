import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from 'react-router-dom';

import Rater_changeInfo from "./rater_changeInfo";
import Rater_main from "./rater_main";
import Rater_main2 from "./rater_main2";
import Rater_fileDetail from "./rater_fileDetail";
import Rater_taskDetail from "./rater_taskDetail";

import axios from "axios";
import "./rater.css";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

interface User{
    MainID: string;
    ID: string;
    Name : string;
}

function Rater(){
    const[user, setUser] = useState<User>({MainID: "", ID: "", Name : ""});
    const getApi = async() =>{
        await axios.get('http://165.132.105.46:3025/homeUI/getuser').then((r)=>{
            let temp: User = r.data;
            setUser(temp);
            console.log(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

    function logoutSuccess() {
        axios.get('http://165.132.105.46:3025/homeUI/logout/').then((r)=> {
            window.location.replace("/");
        })
    }

  return (
      <Router>
        <div className="admin">
            <body>
                <div className="fixed-header">
                    <div className="container">
                        <nav>
                            <a className="n" href="/rater/main">할당된 파일 목록</a>
                            <a className="n" href="/rater/main2">평가 내역</a>

                            <button id={'textButton'} className="nr" onClick={logoutSuccess}>Log out</button>
                            <a className="nr" href="/rater/changeInfo">개인정보 수정</a>
                            <span className="nr" >안녕하세요 {user.Name}({user.ID})님</span>

                        </nav>
                    </div>
                </div>
                <Switch>
                    <Route exact={true} path="/rater/main" component={Rater_main}/>
                    <Route exact path="/rater/main2" component={Rater_main2}/>
                    <Route exact path="/rater/changeInfo" component={Rater_changeInfo}/>
                    <Route exact path="/rater/fileDetail/:submission_id" component={Rater_fileDetail}/>
                    <Route exact path="/rater/taskDetail/:submission_id" component={Rater_taskDetail}/>
                </Switch>
            </body>
        </div>
        <footer>
            <div className={"copyright"}>Copyright@ DB team15 미디미디</div>
            <div className={"names"}>Team1 박선종 | 이재훈 | 조민주 || Team2 성은채 | 이수현 | 한채은</div>
        </footer>
      </Router>
  );
}

export default Rater;
