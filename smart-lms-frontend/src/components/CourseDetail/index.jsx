import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseCard from "../common/CourseCard";

import "./CourseDetail.css";

// 🚧 Fake data tạm thời (sau có thể fetch API hoặc import chung)
const fakeCourses = [
  {
    id: 1,
    title: "React for Beginners",
    description: "Learn React basics step by step",
    instructor: "John Doe",
    category: "Web Development",
    difficulty: "Beginner",
    duration: "short",
    price: "free",
    rating: 4.5,
    language: "English",
    popularity: 200,
    createdAt: "2025-10-01",
    content: ["Intro to React", "JSX & Components", "Props & State"],
    reviews: [
      { user: "Alice", comment: "Very helpful!", rating: 5 },
      { user: "Bob", comment: "Clear explanations", rating: 4 },
    ],
  },
  {
    id: 2,
    title: "Advanced Java Programming",
    description: "Deep dive into Java OOP & Spring Boot",
    instructor: "Jane Smith",
    category: "Programming",
    difficulty: "Advanced",
    duration: "long",
    price: "paid",
    rating: 4.8,
    language: "Vietnamese",
    popularity: 500,
    createdAt: "2025-09-15",
    content: ["OOP Advanced", "Spring Boot REST API", "JPA & Hibernate"],
    reviews: [{ user: "Nam", comment: "Khó nhưng hay", rating: 5 }],
  },
];

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const found = fakeCourses.find((c) => c.id === Number(id));
    setCourse(found);
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Hero Section */}
      <div className="course-hero">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>⭐ {course.rating}</span>
          <span>{course.category}</span>
          <span>{course.language}</span>
        </div>
        <button className="enroll-btn">Enroll Now</button>
      </div>

      {/* 🔹 Instructor */}
      <div className="instructor">
        <img src="https://i.pravatar.cc/80" alt="instructor" />
        <div>
          <h3>{course.instructor}</h3>
          <p>Expert in {course.category}</p>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="tabs">
        {["overview", "content", "reviews"].map((t) => (
          <button
            key={t}
            className={activeTab === t ? "active" : ""}
            onClick={() => setActiveTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* 🔹 Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div>
            <h2>About this course</h2>
            <p>{course.description}</p>
          </div>
        )}

        {activeTab === "content" && (
          <div>
            <h2>Course Content</h2>
            <ul>
              {course.content?.map((item, i) => (
                <li key={i}>📌 {item}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2>Reviews</h2>
            {course.reviews?.map((r, i) => (
              <div key={i} className="review">
                <strong>{r.user}</strong> ⭐ {r.rating}
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Related Courses (reuse CourseCard) */}
      <div className="section">
        <h2>Related Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fakeCourses
            .filter((c) => c.id !== course.id)
            .map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
        </div>
      </div>

      {/* 🔹 Back button */}
      <div className="nav-buttons">
        <Link to="/courses">
          <button>⬅ Back to Courses</button>
        </Link>
      </div>
    </div>
  );
}
