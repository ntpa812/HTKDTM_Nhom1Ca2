import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import CourseCard from "../common/CourseCard";



// 🚀 Fake Data
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
  },
];

export default function CourseSearchFilter() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("Newest");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setCourses(fakeCourses);
    setResults(fakeCourses);
  }, []);

  useEffect(() => {
    let filtered = courses.filter((course) => {
      const text = (
        course.title +
        " " +
        course.description +
        " " +
        course.instructor
      ).toLowerCase();

      if (query && !text.includes(query.toLowerCase())) return false;

      for (let key in filters) {
        if (!filters[key]) continue;
        if (key === "rating") {
          if (course.rating < 4) return false;
        } else if (course[key] !== filters[key]) {
          return false;
        }
      }
      return true;
    });

    switch (sort) {
      case "Popular":
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case "Highest Rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "A-Z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setResults(filtered);
  }, [query, filters, sort, courses]);

  return (
    <div className="p-6 space-y-6">
      <SearchBar value={query} onChange={setQuery} data={courses} />

      <div className="bg-white p-4 rounded-xl shadow">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(filters).map(([key, val]) =>
          val ? (
            <span
              key={key}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full cursor-pointer text-sm"
              onClick={() => setFilters((f) => ({ ...f, [key]: "" }))}
            >
              {key}: {val} ✕
            </span>
          ) : null
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
