// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="overview" element={<Login />} />
        <Route path="banking" element={<Login />} />
        <Route path="budget" element={<Login />} />
        <Route path="pockets" element={<Login />} />
        <Route path="work" element={<Login />} />
        <Route path="preferences" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
