import React, { Fragment,forwardRef} from 'react';
import { BrowserRouter as Router, Route,Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

interface Column {
  id: 'ID' | 'name' | 'birth' | 'ages' | 'sex' | 'role' | 'joined' | 'phoneNum' ;
  label: string;
  minWidth?: number;
  align?: 'center';
  alignment?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'ID', label: 'ID'},
  { id: 'name', label: '이름'},
  { id: 'birth', label: '생년월' },
  { id: 'ages',label: '나이대'},
  {id: 'sex',label: '성별'},
  {id: 'role',label: '역할'},
  {id: 'joined',label: '참여중인\u00a0태스크'},
  {id: 'phoneNum',label: '휴대전화'},
];


interface Data {
    ID: string;
    name: string;
    birth: string;
    ages: string;
    sex: string;
    role: string;
    joined: string;
    phoneNum: string;
}

function createData( ID: string, name: string, birth: string ,ages: string, sex: string, role:string, joined:string, phoneNum:string): Data {
  return { ID, name, birth, ages, sex, role, joined, phoneNum };
}

const rows = [
  createData('music_is_my_life', '박선종',  '98.05.07', '20대', '남', '제출자', '음식점', '01011111111'),
  createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
    createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
    createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
    createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
    createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
    createData('Chaechae', '한채은',  '98.04.22', '20대', '여', '평가자', '', '01012345678'),
];
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//         display: 'flex',
//         alignItems: 'center',
//         height: '0px',
//     },
//     input: {
//         marginBottom: '30px',
//     },
//     iconButton: {
//         marginBottom: '30px',
//         padding: 10,
//     },
//       root1: {
//         width: '1000px',
//         marginTop: '70px',
//     },
//   container: {
//     maxHeight: 440,
//   },
//       button: {
//       display: 'block',
//       marginTop: theme.spacing(2),
//     },
//     formControl: {
//       margin: theme.spacing(1),
//       minWidth: 120,
//     },
//
//   }),
// );
export default function Admin_userList() {
    // const classes = useStyles();
    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // const handleChangePage = (event: unknown, newPage: number) => {
    //     setPage(newPage);
    // };
    // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };
    // const [minUpload, setMinUpload] = React.useState<string | number>('');
    // const [open, setOpen] = React.useState(false);
    //
    // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setMinUpload(event.target.value as number);
    // };
    //
    // const handleClose = () => {
    //     setOpen(false);
    // };
    //
    // const handleOpen = () => {
    //     setOpen(true);
    // };


  return (
      <div className={"userList"}>
      <div className="wrapper">
           <div className="Title">회원 List</div>
          <div className={"userTable"}>

           {/*<div className="right_side_search">*/}
           {/*    <div className={"dropdown"}>*/}
           {/*   <FormControl className={classes.formControl}>*/}
           {/*     <Select*/}
           {/*       labelId="demo-controlled-open-select-label"*/}
           {/*       id="demo-controlled-open-select"*/}
           {/*       open={open}*/}
           {/*       onClose={handleClose}*/}
           {/*       onOpen={handleOpen}*/}
           {/*       value={minUpload}*/}
           {/*       onChange={handleChange}*/}
           {/*       style={{ height: 49, borderRadius:'10px', backgroundColor: 'white', textAlign:'center'}}*/}
           {/*     >*/}
           {/*       <MenuItem value={'ID'}>ID</MenuItem>*/}
           {/*       <MenuItem value={'이름'}>이름</MenuItem>*/}
           {/*       <MenuItem value={'생년월일'}>생년월일</MenuItem>*/}
           {/*       <MenuItem value={'나이대'}>나이대</MenuItem>*/}
           {/*       <MenuItem value={'성별'}>성별</MenuItem>*/}
           {/*       <MenuItem value={'역할'}>역할</MenuItem>*/}
           {/*       <MenuItem value={'참여 태스크'}>참여 태스크</MenuItem>*/}
           {/*       <MenuItem value={'휴대전화'}>휴대전화</MenuItem>*/}
           {/*     </Select>*/}
           {/*   </FormControl>*/}
           {/*</div>*/}
           {/*    <Paper component="form" className={classes.root}>*/}
           {/*       <InputBase*/}
           {/*         className={classes.input}*/}
           {/*         placeholder="회원 검색"*/}
           {/*         inputProps={{ 'aria-label': '회원 검색' }}*/}
           {/*       />*/}
           {/*       <IconButton type="submit" className={classes.iconButton} aria-label="search">*/}
           {/*         <SearchIcon />*/}
           {/*       </IconButton>*/}
           {/*     </Paper>*/}
           {/*</div>*/}
           {/*<div>*/}
           {/*    <Paper className={classes.root1}>*/}
           {/*       <TableContainer className={classes.container}>*/}
           {/*         <Table stickyHeader aria-label="sticky table">*/}
           {/*           <TableHead>*/}
           {/*             <TableRow>*/}
           {/*               {columns.map((column) => (*/}
           {/*                 <TableCell*/}
           {/*                   key={column.id}*/}
           {/*                   align={'center'}*/}
           {/*                   style={{ minWidth: column.minWidth, fontSize: '16px', fontWeight: 'bold' }}*/}
           {/*                 >*/}
           {/*                   {column.label}*/}
           {/*                 </TableCell>*/}
           {/*               ))}*/}
           {/*             </TableRow>*/}
           {/*           </TableHead>*/}
           {/*           <TableBody>*/}
           {/*             {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {*/}
           {/*               return (*/}
           {/*                 <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>*/}
           {/*                   {columns.map((column) => {*/}
           {/*                       const value = row[column.id];*/}
           {/*                       if(row["role"] =="평가자" && column.id == "name"){*/}
           {/*                           return (*/}
           {/*                           <TableCell key={column.id} align='center'*/}
           {/*                           style={{fontSize: '14px', fontWeight: 'normal' }}>*/}
           {/*                               <Link to ="/admin/estimatorDetail">{column.format && typeof value === 'number' ? column.format(value) : value}</Link>*/}
           {/*                           </TableCell>*/}
           {/*                         );*/}
           {/*                       }else if(row["role"] =="제출자" && column.id == "name"){*/}
           {/*                           return (*/}
           {/*                           <TableCell key={column.id} align='center'*/}
           {/*                           style={{fontSize: '14px', fontWeight: 'normal' }}>*/}
           {/*                               <Link to ="/admin/presenterDetail">{column.format && typeof value === 'number' ? column.format(value) : value}</Link>*/}
           {/*                           </TableCell>*/}
           {/*                         );*/}
           {/*                       }else {*/}
           {/*                       return (*/}
           {/*                           <TableCell key={column.id} align='center'*/}
           {/*                           style={{fontSize: '14px', fontWeight: 'normal' }}>*/}
           {/*                               {column.format && typeof value === 'number' ? column.format(value) : value}*/}
           {/*                           </TableCell>*/}
           {/*                       );}*/}
           {/*                     }*/}
           {/*                   )}*/}
           {/*                 </TableRow>*/}
           {/*               );*/}
           {/*             })}*/}
           {/*           </TableBody>*/}
           {/*         </Table>*/}
           {/*       </TableContainer>*/}
           {/*        <TableSortLabel*/}
           {/*             active={true}*/}
           {/*        />*/}
           {/*       <TablePagination*/}
           {/*         rowsPerPageOptions={[10, 20, 30]}*/}
           {/*         component="div"*/}
           {/*         count={rows.length}*/}
           {/*         rowsPerPage={rowsPerPage}*/}
           {/*         page={page}*/}
           {/*         onChangePage={handleChangePage}*/}
           {/*         onChangeRowsPerPage={handleChangeRowsPerPage}*/}
           {/*       />*/}
           {/*     </Paper>*/}

           {/*</div>*/}
           <MaterialTable
               title={""}
              columns={[
                { title: 'ID', field: 'ID' , hideFilterIcon: true, headerStyle:{textAlign:'center'}, cellStyle: {textAlign:"center"}},
                { title: 'name', field: 'name', hideFilterIcon: true, cellStyle: {textAlign:"center"} },
                { title: 'birth', field: 'birth', hideFilterIcon: true, cellStyle: {textAlign:"center"} },
                {
                  title: 'ages',
                  field: 'ages', hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                {
                  title: 'sex',
                  field: 'sex',
                  lookup: { '남': '남', '여': '여' }, hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                {
                  title: 'role',
                  field: 'role',
                  lookup: { '제출자': '제출자', '평가자': '평가자' }, hideFilterIcon: true, cellStyle: {textAlign:"center"}
                },
                { title: 'joined', field: 'joined', hideFilterIcon: true, cellStyle: {textAlign:"center"}},
                {title: 'phoneNum', field: 'phoneNum', type:"numeric", hideFilterIcon: true, cellStyle: {textAlign:"center"}},
              ]}
              data={rows}
              options={{
                filtering: true,
                  filterRowStyle:{backgroundColor:'#F6F6F6'},
                  headerStyle:{textAlign:'center'},
                  searchFieldStyle:{position:'relative', top:'-38px', backgroundColor:'white', borderRadius:'5px'}
              }}

            />
            </div>
       </div>
      </div>
  );
}