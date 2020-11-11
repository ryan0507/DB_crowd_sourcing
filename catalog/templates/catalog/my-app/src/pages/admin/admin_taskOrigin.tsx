import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";

// const users = [
// {
//     'id': 1,
//     'name': '홍길동',
//     'birthday': '961222',
//     'age' : '20대',
//     'gender': '남자',
//     'role': '제출자',
//     'task' : '음식점',
//     'phone' : '010-0000-0000',
// },
// {
//     'id': 2,
//     'name': '나동빈',
//     'birthday': '960508',
//     'age' : '20대',
//     'gender': '남자',
//     'role': '제출자',
//     'task' : '음식점',
//     'phone' : '010-0000-0000',
// },
//     {
//     'id': 3,
//     'name': '이순신',
//     'birthday': '961127',
//     'age' : '20대',
//     'gender': '자',
//     'role': '평가자',
//     'task' : '음식점',
//     'phone' : '010-0000-0000',
//     }
// ]
//
//
// 출처: https://ndb796.tistory.com/216 [안경잡이개발자]

// const columns = [
//       { id: 'name', label: 'Name', minWidth: 170 },
//       { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//       {
//         id: 'population',
//         label: 'Population',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toLocaleString('en-US'),
//       },
//       {
//         id: 'size',
//         label: 'Size\u00a0(km\u00b2)',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toLocaleString('en-US'),
//       },
//       {
//         id: 'density',
//         label: 'Density',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toFixed(2),
//       },
// ];
//
//     function createData(name, code, population, size) {
//       const density = population / size;
//       return { name, code, population, size, density };
//     }
//
//     const rows = [
//       createData('India', 'IN', 1324171354, 3287263),
//       createData('China', 'CN', 1403500365, 9596961),
//       createData('Italy', 'IT', 60483973, 301340),
//       createData('United States', 'US', 327167434, 9833520),
//       createData('Canada', 'CA', 37602103, 9984670),
//       createData('Australia', 'AU', 25475400, 7692024),
//       createData('Germany', 'DE', 83019200, 357578),
//       createData('Ireland', 'IE', 4857000, 70273),
//       createData('Mexico', 'MX', 126577691, 1972550),
//       createData('Japan', 'JP', 126317000, 377973),
//       createData('France', 'FR', 67022000, 640679),
//       createData('United Kingdom', 'GB', 67545757, 242495),
//       createData('Russia', 'RU', 146793744, 17098246),
//       createData('Nigeria', 'NG', 200962417, 923768),
//       createData('Brazil', 'BR', 210147125, 8515767),
//     ];
    //
    // const useStyles = makeStyles({
    //   root: {
    //     width: '100%',
    //   },
    //   container: {
    //     maxHeight: 440,
    //   },
    // });
    //
    // function StickyHeadTable() {
    //   const classes = useStyles();
    //   const [page, setPage] = React.useState(0);
    //   const [rowsPerPage, setRowsPerPage] = React.useState(10);
    //
    //   const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    //   };
    //
    //   const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    //   };
    //
    //   return (
    //     <Paper className={classes.root}>
    //       <TableContainer className={classes.container}>
    //         <Table stickyHeader aria-label="sticky table">
    //           <TableHead>
    //             <TableRow>
    //               {columns.map((column) => (
    //                 <TableCell
    //                   key={column.id}
    //                   align={column.align}
    //                   style={{ minWidth: column.minWidth }}
    //                 >
    //                   {column.label}
    //                 </TableCell>
    //               ))}
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
    //               return (
    //                 <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
    //                   {columns.map((column) => {
    //                     const value = row[column.id];
    //                     return (
    //                       <TableCell key={column.id} align={column.align}>
    //                         {column.format && typeof value === 'number' ? column.format(value) : value}
    //                       </TableCell>
    //                     );
    //                   })}
    //                 </TableRow>
    //               );
    //             })}
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //       <TablePagination
    //         rowsPerPageOptions={[10, 25, 100]}
    //         component="div"
    //         count={rows.length}
    //         rowsPerPage={rowsPerPage}
    //         page={page}
    //         onChangePage={handleChangePage}
    //         onChangeRowsPerPage={handleChangeRowsPerPage}
    //       />
    //     </Paper>
    //   );
    // }

function admin_taskOrigin(){
   return(
       <div className="wrapper">
           <div className="Title">새마을식당_10월.csv</div>
           <Link to = "/admin/taskinfo" className="right_side_small">뒤로가기</Link>
           <div className="formContent">
               {/*<Table>*/}
               {/*    <TableHead>*/}
               {/*        <TableRow>*/}
               {/*            <TableCell>ID</TableCell>*/}
               {/*            <TableCell>이름</TableCell>*/}
               {/*            <TableCell>생년월일</TableCell>*/}
               {/*            <TableCell>나이대</TableCell>*/}
               {/*            <TableCell>성별</TableCell>*/}
               {/*            <TableCell>역할</TableCell>*/}
               {/*            <TableCell>참여중인 태스크</TableCell>*/}
               {/*            <TableCell>휴대전화</TableCell>*/}
               {/*        </TableRow>*/}
               {/*    </TableHead>*/}
               {/*    <TableBody>*/}
               {/*        {users.map(c =>{*/}
               {/*            return<table key={c.id} id={c.id} name={c.name} birthday={c.birthday} age={c.age} gender={c.gender} role={c.role} task={c.task} phone={c.phone}/>*/}
               {/*        })}*/}
               {/*    </TableBody>*/}
               {/*</Table>*/}
               <Link to = "/admin/table">내용</Link>
           </div>
       </div>
   );
}

export default admin_taskOrigin;