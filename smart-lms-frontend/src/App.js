import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import Courses from "./pages/Courses";
import Analytics from "./pages/Analytics";

function App() {
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="learning-path" element={<LearningPath />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="analytics" element={<Analytics />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
