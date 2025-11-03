import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages của bạn
import Login from './pages/Login';
import DashboardRouter from './pages/DashboardRouter';
import LearningPath from './pages/LearningPath';
import LearningPathDetailPage from './pages/LearningPathDetailPage';
import InstructorLearningPaths from './pages/InstructorLearningPaths';
import PrivateRoute from './components/PrivateRoute';
import Analytics from './pages/Analytics';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* === ROUTE CÔNG KHAI === */}
        <Route path="/login" element={<Login />} />

        {/* === CÁC ROUTE ĐƯỢC BẢO VỆ === */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><DashboardRouter /></PrivateRoute>}
        />

        {/* --- CÁC ROUTE CHO KHÓA HỌC (COURSES) --- */}
        <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
        <Route path="/courses/:id" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />

        {/* ==================================================================== */}

        {/* --- CÁC ROUTE CHO LỘ TRÌNH HỌC (LEARNING PATHS) --- */}
        <Route
          path="/learning"
          element={<PrivateRoute><LearningPath /></PrivateRoute>}
        />
        <Route
          path="/learning-paths/:id"
          element={<PrivateRoute><LearningPathDetailPage /></PrivateRoute>}
        />
        <Route
          path="/instructor/learning-paths"
          element={<PrivateRoute><InstructorLearningPaths /></PrivateRoute>}
        />

        {/* --- ROUTE CHO PHÂN TÍCH (ANALYTICS) --- */}
        <Route
          path="/analytics"
          element={<PrivateRoute><Analytics /></PrivateRoute>}
        />

        <Route
          path="/settings"
          element={<PrivateRoute><Settings /></PrivateRoute>}
        />

        {/* === ROUTE MẶC ĐỊNH === */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
