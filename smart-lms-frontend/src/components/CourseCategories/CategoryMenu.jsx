import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Programming", icon: "💻" },
  { name: "Data Science", icon: "📊" },
  { name: "Web Development", icon: "🌐" },
  { name: "AI/ML", icon: "🤖" },
  { name: "DevOps", icon: "⚙️" },
  { name: "Database", icon: "🗄️" },
  { name: "Design", icon: "🎨" },
  { name: "Business", icon: "📈" },
];

export default function CategoryMenu({ currentCategory }) {
  const navigate = useNavigate();

  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li
          key={cat.name}
          onClick={() => navigate(`/categories/${cat.name}`)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition 
            ${
              currentCategory === cat.name
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600">
            {cat.icon}
          </span>
          <span>{cat.name}</span>
        </li>
      ))}
    </ul>
  );
}
