import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white shadow-lg flex flex-col">
                <div className="h-16 flex items-center justify-center font-bold text-xl text-indigo-700 border-b">Smart LMS</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-50 text-indigo-700 font-semibold transition"><span className="mr-3">🏠</span> Dashboard</Link>
                    <Link to="/learning-path" className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700"><span className="mr-3">📚</span> Learning Path</Link>
                    <Link to="/courses" className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700"><span className="mr-3">📖</span> Courses</Link>
                    <Link to="/analytics" className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700"><span className="mr-3">📊</span> Analytics</Link>
                </nav>
            </aside>
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
                    <span className="text-lg font-semibold text-indigo-700">Trang quản trị học tập thông minh</span>
                    {/* Có thể bổ sung avatar, logout ở đây */}
                </header>
                {/* Nội dung động */}
                <main className="flex-1 overflow-auto p-8 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
