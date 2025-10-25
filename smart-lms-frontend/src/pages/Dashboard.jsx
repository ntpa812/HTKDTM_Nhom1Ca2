import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    // Mock data
    const progressData = [
        { name: 'T1', progress: 30 },
        { name: 'T2', progress: 45 },
        { name: 'T3', progress: 60 },
        { name: 'T4', progress: 75 },
    ];

    const knowledgeGapData = [
        { subject: 'Toán', mastery: 85, gap: 15 },
        { subject: 'Lập trình', mastery: 70, gap: 30 },
        { subject: 'Cơ sở dữ liệu', mastery: 90, gap: 10 },
        { subject: 'AI/ML', mastery: 60, gap: 40 },
    ];

    const recommendedCourses = [
        { id: 1, title: 'Deep Learning cơ bản', difficulty: 'Trung bình', match: 92 },
        { id: 2, title: 'Python nâng cao', difficulty: 'Khó', match: 88 },
        { id: 3, title: 'Data Structures', difficulty: 'Dễ', match: 85 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Tổng quan về tiến độ học tập của bạn</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Khóa học đang học" value="5" change="+2" color="bg-blue-500" />
                <StatCard title="Bài tập hoàn thành" value="24" change="+8" color="bg-green-500" />
                <StatCard title="Điểm trung bình" value="8.5" change="+0.3" color="bg-purple-500" />
                <StatCard title="Thời gian học" value="42h" change="+12h" color="bg-orange-500" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Tiến độ học tập</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="progress" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Knowledge Gap Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Phân tích lỗ hổng kiến thức</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={knowledgeGapData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="mastery" fill="#10B981" name="Mức độ thành thạo" />
                            <Bar dataKey="gap" fill="#EF4444" name="Lỗ hổng" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Khóa học được đề xuất (AI)</h2>
                <div className="space-y-3">
                    {recommendedCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{course.title}</h3>
                                <p className="text-sm text-gray-500">Độ khó: {course.difficulty}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Độ phù hợp</p>
                                    <p className="text-lg font-bold text-primary">{course.match}%</p>
                                </div>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
                                    Bắt đầu học
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, color }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <span className="text-sm text-green-600 font-medium">{change}</span>
        </div>
    </div>
);

export default Dashboard;
