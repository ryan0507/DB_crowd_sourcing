// import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
// import React, {useEffect, useState} from 'react';
// import axios from 'axios'


// export default class Submit_main extends React.Component {
//     state = {
//         person : []
//     }
//     componentDidMount() {
//         axios.get("http://127.0.0.1:8000/DB/11/")
//             .then(res => {
//                 console.log(res);
//                 this.setState({persons:res.data});
//             })
//     }
//     render() {
//         return(
//            <div className="submit_main">
//                <div className="wrapper">
//                <div className="Title">태스크 목록</div>
//                <ul className={"task_list"}>
//                    {this.state.person.map(person =>
//                        <li>
//                            <Link to = "/submit/taskinfo">
//                            <div className="content_list">
//                                <div className={"taskName"}>{person.TaskID}</div>
//                                <div className={"applicant"}>참여 신청 완료</div>
//                                <div className={"aboutTask"}>태스크 설명~~~~~</div>
//                            </div>
//                         </Link>
//                        </li>)}
//                </ul>
//            </div>
//            </div>
//        );
//     }
// }

import { RouteComponentProps, BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface Task{
    TaskID: string;
    Name : string;
    Description: string;
}

const Submit_main = (props : RouteComponentProps<{}>,)=>{
    const[task, setTask] = useState<Task[]>([]);
    const getApi = async() =>{
        await axios.get('http://127.0.0.1:8000/submitUI/').then((r)=>{
            let temp: Task[] = r.data;
            setTask(temp);
        })
    }

    useEffect(()=>{
        getApi()
    },[])

   return(
       <div className="wrapper">
           <div className="Title">태스크 목록</div>
           {task.map((item)=>{
               return(
                   <ul className={"task_list"}>
                       <li>
                           <Link to = {`/submit/taskinfo/${item.TaskID}`}>
                               <div className="content_list">
                                   <div className={"taskName"}>{item.Name}</div>
                                   <div className={"applicant"}>참여 신청 완료</div>
                                   <div className={"aboutTask"}>{item.Description}</div>
                               </div>
                            </Link>
                       </li>
                   </ul>
               )
           })}

       </div>
   );
}

export default Submit_main;

// class submit_main extends React.Component {
//     state = {
//         courses: []
//     }
//     constructor() {
//         // @ts-ignore
//         super();
//         api.get('/',{headers : {"access-control-allow-origin" : "*"}}).then(res => {
//             console.log(res.data);
//             this.setState({courses: res.data});
//             })
//     }
//
//     render() {
//         return(
//            <div className="submit_main">
//            {/*    <div className="wrapper">*/}
//            {/*    <div className="Title">태스크 목록</div>*/}
//            {/*    <ul className={"task_list"}>*/}
//            {/*        <li>*/}
//            {/*            <Link to = "/submit/taskinfo">*/}
//            {/*                <div className="content_list">*/}
//            {/*                    <div className={"taskName"}>{this.state.courses.map(course => course.TaskID)}</div>*/}
//            {/*                    <div className={"applicant"}>참여 신청 완료</div>*/}
//            {/*                    <div className={"aboutTask"}>태스크 설명~~~~~</div>*/}
//            {/*                </div>*/}
//            {/*             </Link>*/}
//            {/*        </li>*/}
//            {/*    </ul>*/}
//            {/*</div>*/}
//            </div>
//        );
//     }
// }



// export default class submit_main extends React.Component {
//     state = {
//         loading: true,
//         person: null
//     };
//
//     async componentDidMount() {
//         const url = "https://api.randomuser.me/";
//         const response = await fetch(url);
//         const data = await response.json();
//         this.setState({person : data.results[0], loading: false});
//         // console.log(data.results[0]);
//     }
//     render() {
//         if (this.state.loading) {
//             return <div>loading...</div>
//         }
//         if (this.state.person !== null) {
//             alert(this.state.person.name.f);
//         } else {
//             return (
//                 <div>
//                     <div>{.name.fisrt}</div>
//                     <div>{this.state.person.name.fisrt}</div>
//                     <img src = {this.state.person.picture.large}/>
//                 </div>
//         );
//         }
//
//     }
// }

// function submit_main(){
//    return(
//        <div className="submit_main">
//            <div className="wrapper">
//            <div className="Title">태스크 목록</div>
//            <ul className={"task_list"}>
//                <li>
//                    <Link to = "/submit/taskinfo">
//                        <div className="content_list">
//                            <div className={"taskName"}>태스크 이름</div>
//                            <div className={"applicant"}>참여 신청 완료</div>
//                            <div className={"aboutTask"}>태스크 설명~~~~~</div>
//                        </div>
//                     </Link>
//                </li>
//            </ul>
//        </div>
//        </div>
//    );
// }
// export default Submit_main;
