import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardRouter from './pages/DashboardRouter';
import Courses from './pages/Courses';
import Analytics from './pages/Analytics';
import LearningPath from './pages/LearningPath';
import CourseDetail from './components/CourseDetail/index.jsx';
import CourseSearchFilter from './components/CourseSearchFilter/index.jsx';
import CourseCategories from './components/CourseCategories/index.jsx';
import RichTextEditor from './components/RichTextEditor';

function App() {
  // ✅ Kiểm tra đăng nhập
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // ✅ Định nghĩa PrivateRoute
  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  // ✅ Đưa handleSaveContent ra ngoài (ngang hàng với PrivateRoute)
  const handleSaveContent = (content) => {
    console.log("Nội dung đã lưu:", content);
    localStorage.setItem("savedContent", content);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />


        <Route
          path="/courses/search"
          element={
            <PrivateRoute>
              <CourseSearchFilter />
            </PrivateRoute>
          }
        />


        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />


        <Route
          path="/courses/:id"
          element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
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
          path="/categories/:category"
          element={
            <PrivateRoute>
              <CourseCategories />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CourseCategories />
            </PrivateRoute>
          }
        />

        {/* ✅ Truyền hàm onSave vào RichTextEditor */}
        <Route
          path="/rich-text-editor"
          element={
            <PrivateRoute>
              <RichTextEditor onSave={handleSaveContent} />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
