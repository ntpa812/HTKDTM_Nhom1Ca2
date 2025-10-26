import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseDetail.css";

const fakeCourse = {
  id: 1,
  title: "React cho Người Mới Bắt Đầu",
  description:
    "Khoá học React cơ bản giúp bạn làm chủ component, state, props, hooks và xây dựng ứng dụng SPA.",
  duration: "12 giờ",
  rating: 4.5,
  enrolled: 2350,
  instructor: {
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/100?img=5",
    bio: "Senior Frontend Developer tại Công ty XYZ, có 5 năm kinh nghiệm với React và hệ sinh thái JavaScript.",
  },
  outcomes: [
    "Hiểu các khái niệm cơ bản trong React",
    "Quản lý state và props hiệu quả",
    "Sử dụng React Router để điều hướng",
    "Tích hợp API vào ứng dụng React",
  ],
  requirements: [
    "Kiến thức cơ bản về HTML, CSS, JavaScript",
    "Laptop có cài đặt Node.js và npm/yarn",
  ],
  curriculum: [
    { week: 1, title: "Giới thiệu & Setup môi trường" },
    { week: 2, title: "JSX và Component" },
    { week: 3, title: "State & Props" },
    { week: 4, title: "React Router & Project nhỏ" },
  ],
  reviews: [
    { user: "Minh", rating: 5, comment: "Khoá học rất dễ hiểu 👍" },
    { user: "Lan", rating: 4, comment: "Nội dung hay, giảng viên nhiệt tình" },
  ],
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // ✅ tab state

  useEffect(() => {
    setCourse(fakeCourse);
  }, [id]);

  if (!course) return <p>Đang tải...</p>;

  return (
    <div className="course-detail">
      {/* Nút Back */}
      <div className="nav-buttons">
        <button onClick={() => navigate(-1)}>⬅ Quay lại</button>
        <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
        <button onClick={() => navigate("/courses")}>📚 Danh sách khóa học</button>
      </div>

      {/* Hero Section */}
      <div className="course-hero">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>⏱ {course.duration}</span>
          <span>⭐ {course.rating}</span>
          <span>👥 {course.enrolled} học viên</span>
        </div>
        <button className="enroll-btn">Đăng ký ngay</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "curriculum" ? "active" : ""}
          onClick={() => setActiveTab("curriculum")}
        >
          Curriculum
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <>
            <div className="instructor">
              <img src={course.instructor.avatar} alt={course.instructor.name} />
              <div>
                <h3>Giảng viên: {course.instructor.name}</h3>
                <p>{course.instructor.bio}</p>
              </div>
            </div>
            <div className="section">
              <h2>Kết quả học tập</h2>
              <ul>
                {course.outcomes.map((item, index) => (
                  <li key={index}>✅ {item}</li>
                ))}
              </ul>
            </div>
            <div className="section">
              <h2>Yêu cầu</h2>
              <ul>
                {course.requirements.map((item, index) => (
                  <li key={index}>📌 {item}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === "curriculum" && (
          <div className="section">
            <h2>Curriculum</h2>
            <ul>
              {course.curriculum.map((c, idx) => (
                <li key={idx}>
                  📖 Tuần {c.week}: {c.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="section">
            <h2>Reviews</h2>
            {course.reviews.map((r, idx) => (
              <div key={idx} className="review">
                <p>
                  <b>{r.user}</b> ⭐ {r.rating}
                </p>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
