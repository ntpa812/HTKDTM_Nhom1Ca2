import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages của bạn
import Login from './pages/Login';
import DashboardRouter from './pages/DashboardRouter';
import LearningPath from './pages/LearningPath';
import LearningPathDetailPage from './pages/LearningPathDetailPage';
import InstructorLearningPaths from './pages/InstructorLearningPaths';
import PrivateRoute from './components/PrivateRoute';

// SỬA LỖI: Thêm import cho trang Courses
import Courses from './pages/Courses'; // Giả sử component của bạn tên là Courses và nằm ở đây

function App() {
  return (
    <Router>
      <Routes>
        {/* === ROUTE CÔNG KHAI === */}
        <Route path="/login" element={<Login />} />

        {/* === CÁC ROUTE ĐƯỢC BẢO VỆ === */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />

        {/* SỬA LỖI: Thêm lại route cho trang Khóa học */}
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
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
          path="/learning-paths/:id" // Đảm bảo dùng :id như đã thống nhất
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

        {/* === ROUTE MẶC ĐỊNH === */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
