// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Overview from './components/Overview/Overview';
import ProtectedRoutes from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Overview />} />
        <Route path="/banking" element={<Overview />} />
        <Route path="/budget" element={<Overview />} />
        <Route path="/pockets" element={<Overview />} />
        <Route path="/work" element={<Overview />} />
        <Route path="/preferences" element={<Overview />} />
      </Route>
    </Routes>
  );
}

export default App;
