import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CategoryMenu from "./CategoryMenu";
import CourseCard from "../common/CourseCard";

// Fake data (sau này thay bằng API)
const fakeCourses = [
  { id: 1, title: "React for Beginners", category: "Web Development", instructor: "John Doe", description: "Learn React step by step", rating: 4.5, price: "free", language: "English" },
  { id: 2, title: "Advanced Java Programming", category: "Programming", instructor: "Jane Smith", description: "OOP + Spring Boot", rating: 4.8, price: "paid", language: "Vietnamese" },
  { id: 3, title: "Machine Learning 101", category: "AI/ML", instructor: "Mike Lee", description: "ML Basics with Python", rating: 4.6, price: "free", language: "English" },
];

export default function CourseCategories() {
  const { category } = useParams();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setCourses(fakeCourses.filter((c) => c.category === category));
    } else {
      setCourses(fakeCourses);
    }
  }, [category]);

  return (
    <div className="flex gap-6 p-6 max-w-7xl mx-auto">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-2xl p-5 hidden md:block">
        <h2 className="text-lg font-bold mb-4 text-gray-700">📚 Categories</h2>
        <CategoryMenu currentCategory={category} />
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/dashboard" className="hover:underline">🏠 Home</Link>
          {category && <> / <span className="font-medium text-indigo-600">{category}</span></>}
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            {category ? category : "All Categories"}
          </h2>
          {category && (
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate("/categories")}
            >
              View all
            </button>
          )}
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((c) => <CourseCard key={c.id} course={c} />)
          ) : (
            <div className="text-gray-500 italic">No courses found for this category.</div>
          )}
        </div>
      </main>
    </div>
  );
}
