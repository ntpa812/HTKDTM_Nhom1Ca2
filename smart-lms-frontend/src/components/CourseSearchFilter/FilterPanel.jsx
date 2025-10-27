import React from "react";

export default function FilterPanel({ filters, setFilters, sort, setSort }) {
  const updateFilter = (key, val) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const baseClass =
    "border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <select className={baseClass} onChange={(e) => updateFilter("category", e.target.value)}>
        <option value="">Category</option>
        <option value="Web Development">Web Development</option>
        <option value="Programming">Programming</option>
      </select>

      <select className={baseClass} onChange={(e) => updateFilter("difficulty", e.target.value)}>
        <option value="">Difficulty</option>
        <option value="Beginner">Beginner</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select className={baseClass} onChange={(e) => updateFilter("duration", e.target.value)}>
        <option value="">Duration</option>
        <option value="short">Short (&lt;5h)</option>
        <option value="medium">Medium (5–15h)</option>
        <option value="long">Long (&gt;15h)</option>
      </select>

      <select className={baseClass} onChange={(e) => updateFilter("price", e.target.value)}>
        <option value="">Price</option>
        <option value="free">Free</option>
        <option value="paid">Paid</option>
      </select>

      <select className={baseClass} onChange={(e) => updateFilter("language", e.target.value)}>
        <option value="">Language</option>
        <option value="English">English</option>
        <option value="Vietnamese">Vietnamese</option>
      </select>

      <select className={baseClass} onChange={(e) => updateFilter("rating", e.target.value)}>
        <option value="">Rating</option>
        <option value="4+">4+ stars</option>
      </select>

      {/* 🔹 New: Instructor filter */}
      <select className={baseClass} onChange={(e) => updateFilter("instructor", e.target.value)}>
        <option value="">Instructor</option>
        <option value="John Doe">John Doe</option>
        <option value="Jane Smith">Jane Smith</option>
      </select>

      <select className={baseClass} value={sort} onChange={(e) => setSort(e.target.value)}>
        <option>Newest</option>
        <option>Popular</option>
        <option>Highest Rated</option>
        <option>A-Z</option>
      </select>
    </div>
  );
}
