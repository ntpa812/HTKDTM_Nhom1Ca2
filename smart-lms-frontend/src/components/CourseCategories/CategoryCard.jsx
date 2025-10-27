import React from "react";

export default function CategoryCard({ category, icon, color, count, onClick }) {
  return (
    <div
      className={`p-5 rounded-xl shadow cursor-pointer hover:shadow-lg transition ${color}`}
      onClick={onClick}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg">{category}</h3>
      <p className="text-sm text-gray-600">{count} courses</p>
    </div>
  );
}
