import React from 'react';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import InputProblem from './InputProblem';
import Strategy from './Strategy';
import '../App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './LoginPage';

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#022839]  to-[#3e3656]'>
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<LoginPage />} />
          <Route path='/landingpage' exact element={<LandingPage />} />
          <Route path='/dashboard' exact element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
