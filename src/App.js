import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Layout from './Components/Layout';
import {LocalizeProvider} from 'react-localize-redux'

function App() {
  return ( 
    <LocalizeProvider>
      <Layout />
    </LocalizeProvider>
  );
}

export default App;
