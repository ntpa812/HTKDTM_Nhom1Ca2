import React, { useState } from "react";

export default function SearchBar({ value, onChange, data }) {
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 1) {
      const s = data
        .filter((d) =>
          (d.title + " " + d.description + " " + d.instructor)
            .toLowerCase()
            .includes(val.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(s);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="border w-full px-4 py-3 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="🔎 Search courses..."
        value={value}
        onChange={handleInput}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-2 rounded-lg shadow-lg z-10">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(s.title);
                setSuggestions([]);
              }}
            >
              <span className="font-medium">{s.title}</span> –{" "}
              <span className="text-gray-500">{s.instructor}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
