import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


interface Column {
  id: 'name' | 'date' | 'time' | 'fileName' | 'pNp' | 'score';
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: '제출 회차', minWidth: 80 },
  { id: 'date', label: '제출일', minWidth: 80 },
  {
    id: 'time',
    label: '제출시간',
    minWidth: 90,
  },
  {
    id: 'fileName',
    label: '제출\u00a0파일명',
    minWidth: 140,
  },
  {
    id: 'pNp',
    label: 'Pass\u00a0여부',
    minWidth: 80,
  },
  {
    id: 'score',
    label: '점수',
    minWidth: 80,
  },
];

const useStyles = makeStyles((theme: Theme) =>
      createStyles({
          root: {
              width: '100%',
          },
          container: {
              maxHeight: 440,
          },
          formControl: {
              margin: theme.spacing(1),
              minWidth: 120,
          },
    }),
);


interface Data {
  name: string;
  date: string;
  time: string;
  fileName: string;
  pNp: string;
  score: string;
}

function createData( name: string, date: string, time: string,fileName: string, pNp: string, score: string): Data {
  return { name, date, time, fileName, pNp, score};
}

const rows = [
  createData('1회', '20.11.01', '23 : 15 : 20', '음악은_즐거워.csv', 'Non-pass', "10점"),
  createData('2회', '20.11.02', '23 : 15 : 30', '새마을식당_10월.csv', 'Pass', "10점"),
];


export default function Rater_taskDetail(){
    const [open, setOpen] = React.useState(false);
    const [minUpload, setMinUpload] = React.useState<string | number>('');
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMinUpload(event.target.value as number);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

   return(
       <div className="wrapper">
           <div className="Title">태스크 이름</div>
           <Link to = "/rater/main2" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               <div className={"TaskInfo"}>
                   <div className={"wrapper_title"}>태스크 설명</div>
                   <div className={"lightgray_wrapper"}>이 태스크는 이런 태스크입니다.</div>
               </div>
               <div className={"TaskPassStandard"}>
                   <div className={"wrapper_title"}>태스크 PASS 기준</div>
                   <div className={"lightgray_wrapper"}>패스 기준</div>
               </div>
               <div className={"TaskPassStandard"}>
                   <div className={"wrapper_title"}>회차</div>
                   <div className={"lightgray_wrapper"}>3회</div>
               </div>
               <div className={"TaskPassStandard"}>
                   <div className={"wrapper_title"}>기간</div>
                   <div className={"lightgray_wrapper"}>2020년 10월 21일 ~ 2020년 11월 21일</div>
               </div>
               <div className={"TaskPassStandard"}>
                   <div className={"wrapper_title"}>파일 다운로드</div>
                   <div className={"lightgray_wrapper_file"}>새마을식당.csv</div>
               </div>
               <div className={"TaskName"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 이름</div>
                   <div className={"lightgray_wrapper"}>이름</div>
               </div>
               <div className={"TaskSchema"}>
                   <div className={"wrapper_title"}>태스크 데이터 테이블 스키마</div>
                   <ul className={"datatype_list"}>
                       <li>

                           <ul className={"value_list"}>
                               <li>
                                   <div className={"name"}>제출자 이름</div>
                                   <div className={"type"}>(String)</div>
                               </li>
                               <li>
                                   <div className={"name"}>음식점 이름</div>
                                   <div className={"type"}>(String)</div>
                               </li>
                               <li>
                                   <div className={"name"}>월매출</div>
                                   <div className={"type"}>(Int)</div>
                               </li>
                               <li>
                                   <div className={"name"}>월 고객 수</div>
                                   <div className={"type"}>(Int)</div>
                               </li>
                               <li>
                                   <div className={"name"}>월 순이익</div>
                                   <div className={"type"}>(Int)</div>
                               </li>
                               <li>
                                   <div className={"name"}>직원 수</div>
                                   <div className={"type"}>(Int)</div>
                               </li>
                           </ul>
                       </li>
                   </ul>

               </div>
               <div className={"originDataType"}>
                   <div className={"wrapper_title"}>선택된 원본 데이터 타입</div>
                   <ul className={"datatype_list"}>
                       <li>
                           <div className={"datatypeID"}>ID : 001</div>
                           <ul className={"value_list"}>
                               <li>
                                   <div className={"decidedName"}>음식점 이름</div>
                                   <div className={"originName"}>음식점 이름</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 매출</div>
                                   <div className={"originName"}>월 매출</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 고객 수</div>
                                   <div className={"originName"}>월 고객 수</div>
                               </li>
                               <li>
                                   <div className={"decidedName"}>월 순이익</div>
                                   <div className={"originName"}>월 순이익</div>
                               </li>
                           </ul>

                       </li>
                   </ul>

               </div>
               <div className={"TaskPassStandard"}>
                   <div className={"wrapper_title"}>점수</div>
                   <div className={"lightgray_wrapper"}>5점</div>
               </div>
               <div className={"TaskPassStandard"}>
                   <div className={"wrapper_title"}>P/NP</div>
                   <div className={"lightgray_wrapper"}>PASS</div>
               </div>

           </div>


       </div>
   );
}
