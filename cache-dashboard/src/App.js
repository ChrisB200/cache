// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Overview from './components/Overview/Overview';
import Banking from './components/Banking/Banking';
import Budget from './components/Budget/Budget';
import Pockets from './components/Pockets/Pockets';
import Work from './components/Work/Work';
import Preferences from './components/Preferences/Preferences';
import ProtectedRoutes from './components/ProtectedRoute';
import HomeRedirect from './components/HomeRedirect';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/pockets" element={<Pockets />} />
        <Route path="/work" element={<Work />} />
        <Route path="/preferences" element={<Preferences />} />
      </Route>
    </Routes>
  );
}

export default App;
