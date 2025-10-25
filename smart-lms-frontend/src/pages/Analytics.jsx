import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Analytics() {
    const [stats, setStats] = useState({ totalCourses: 0, totalProgress: 0, chart: [] });

    useEffect(() => {
        axios.get("/api/analytics/overview")
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-indigo-700">Thống kê học tập</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="font-semibold mb-2">Tổng khoá học</h2>
                    <div className="text-3xl font-bold text-indigo-600">{stats.totalCourses}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="font-semibold mb-2">Tổng lượt học viên</h2>
                    <div className="text-3xl font-bold text-indigo-600">{stats.totalProgress}</div>
                </div>
            </div>
            <div className="bg-white rounded shadow p-6 mt-4">
                <h3 className="font-semibold mb-3">Số lượng học viên/khoá</h3>
                <ul className="mt-4">
                    {stats.chart.map((item, idx) => (
                        <li key={idx} className="flex justify-between py-2 border-b">
                            <span>{item.name}</span>
                            <span className="font-medium text-indigo-500">{item.students} học viên</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
