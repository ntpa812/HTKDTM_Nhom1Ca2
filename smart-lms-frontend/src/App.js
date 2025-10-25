import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import Courses from './pages/Courses';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        <Route index element={<Dashboard />} />
        <Route path="learning-path" element={<LearningPath />} />
        <Route path="courses" element={<Courses />} />
        <Route path="analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
