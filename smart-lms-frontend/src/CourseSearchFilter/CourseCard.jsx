import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
      <div className="text-sm text-gray-500 mb-1">👨‍🏫 {course.instructor}</div>
      <div className="text-sm mb-1">⭐ {course.rating}</div>
      <div className="text-xs text-gray-500">
        {course.price === "free" ? "Free" : "Paid"} | {course.language}
      </div>
    </div>
  );
}
