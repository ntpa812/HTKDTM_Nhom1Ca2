// smart-lms-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages của bạn
import Login from './pages/Login';
import DashboardRouter from './pages/DashboardRouter'; // Component điều hướng dashboard
import LearningPath from './pages/LearningPath';
import LearningPathDetailPage from './pages/LearningPathDetailPage';
import InstructorLearningPaths from './pages/InstructorLearningPaths';
import PrivateRoute from './components/PrivateRoute'; // Component bảo vệ route

function App() {
  return (
    <Router>
      {/* Tất cả các component sử dụng hooks của router phải nằm trong này */}
      <Routes>
        {/* Các route công khai */}
        <Route path="/login" element={<Login />} />

        {/* Các route được bảo vệ */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <PrivateRoute>
              <LearningPath />
            </PrivateRoute>
          }
        />
        <Route
          path="/learning-paths/:slug"
          element={
            <PrivateRoute>
              <LearningPathDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/learning-paths"
          element={
            <PrivateRoute>
              <InstructorLearningPaths />
            </PrivateRoute>
          }
        />

        {/* Route mặc định, chuyển hướng về dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Thêm các route khác của bạn ở đây */}

      </Routes>
    </Router>
  );
}

export default App;
