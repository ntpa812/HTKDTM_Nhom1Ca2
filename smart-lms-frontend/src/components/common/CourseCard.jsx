import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl 
                 transition transform hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      {/* Banner */}
      <div className="h-28 bg-gradient-to-r from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
        {course.title.charAt(0)}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          👨‍🏫 {course.instructor}
        </div>
        <div className="flex items-center gap-2 text-sm text-yellow-500 mb-2">
          ⭐ {course.rating}
        </div>
        <span className="inline-block text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-600">
          {course.price === "free" ? "Free" : "Paid"} | {course.language}
        </span>
      </div>
    </div>
  );
}
