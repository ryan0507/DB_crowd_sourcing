import React from 'react';
import './App.css';
import admin from './pages/admin/admin';
// import login from './pages/login'


function App() {
  return (
        <div className="App">
            <body>
                {admin()}
            </body>
        </div>
  );
}

export default App;
