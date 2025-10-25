import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get("/api/courses")
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-indigo-700">Danh sách khoá học</h1>
            <div className="bg-white p-4 rounded-lg shadow">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Tên khoá học</th>
                            <th className="px-4 py-2 text-left">Mức độ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((c, idx) => (
                            <tr key={c.id} className="border-t hover:bg-indigo-50">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2 font-semibold">{c.title}</td>
                                <td className="px-4 py-2">{c.difficulty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}