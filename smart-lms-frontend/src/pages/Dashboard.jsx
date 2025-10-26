import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import RecentActivities from '../components/dashboard/RecentActivities';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import './Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        { subject: 'CSDL', mastery: 90, gap: 10 },
        { subject: 'AI/ML', mastery: 60, gap: 40 },
    ];

    const recommendedCourses = [
        { id: 1, title: 'Deep Learning cơ bản', difficulty: 'Trung bình', match: 92 },
        { id: 2, title: 'Python nâng cao', difficulty: 'Khó', match: 88 },
        { id: 3, title: 'Data Structures', difficulty: 'Dễ', match: 85 },
    ];

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-loading">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="dashboard-main-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <h2 className="dashboard-page-title">Dashboard</h2>
                        <p className="dashboard-page-subtitle">Tổng quan về tiến độ học tập của bạn</p>
                    </div>
                    <div className="dashboard-header-right">
                        <span className="dashboard-welcome-text">
                            Xin chào, <strong>{user?.full_name || user?.username}</strong>! 👋
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div className="dashboard-content">
                    {/* Stats Cards */}
                    <div className="dashboard-stats-grid">
                        <StatCard title="Khóa học đang học" value="5" change="+2" color="#667eea" />
                        <StatCard title="Bài tập hoàn thành" value="24" change="+8" color="#10B981" />
                        <StatCard title="Điểm trung bình" value="8.5" change="+0.3" color="#764ba2" />
                        <StatCard title="Thời gian học" value="42h" change="+12h" color="#F59E0B" />
                    </div>

                    {/* Charts/Performance + Deadlines/AI Courses/Activities */}
                    <div className="dashboard-main-grid">
                        {/* Left Column - Charts + Performance Metrics */}
                        <div className="dashboard-charts-column">
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">📈 Tiến độ học tập</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={progressData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="name" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="progress" stroke="#667eea" strokeWidth={3} name="Tiến độ (%)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">🎯 Phân tích lỗ hổng kiến thức</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={knowledgeGapData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="subject" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="mastery" fill="#10B981" name="Mức độ thành thạo" />
                                        <Bar dataKey="gap" fill="#EF4444" name="Lỗ hổng" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <PerformanceMetrics />
                        </div>

                        {/* Right Column - REORDERED: Deadlines → AI Courses → Activities */}
                        <div className="dashboard-activities-column">
                            {/* 1. Deadline sắp tới */}
                            <UpcomingDeadlines />

                            {/* 2. Khóa học được đề xuất bởi AI */}
                            <div className="dashboard-recommend-card">
                                <h3 className="dashboard-recommend-title">🤖 Khóa học được đề xuất (AI)</h3>
                                <div className="dashboard-courses-list">
                                    {recommendedCourses.map((course) => (
                                        <div key={course.id} className="dashboard-course-item">
                                            <div className="dashboard-course-info">
                                                <h4 className="dashboard-course-title">{course.title}</h4>
                                                <p className="dashboard-course-difficulty">Độ khó: {course.difficulty}</p>
                                            </div>
                                            <div className="dashboard-course-actions">
                                                <div className="dashboard-match-info">
                                                    <p className="dashboard-match-label">Độ phù hợp</p>
                                                    <p className="dashboard-match-value">{course.match}%</p>
                                                </div>
                                                <button className="dashboard-start-btn">Bắt đầu học</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Hoạt động gần đây */}
                            <RecentActivities />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// StatCard Component
const StatCard = ({ title, value, change, color }) => (
    <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ backgroundColor: color }}>
            <svg className="dashboard-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        <h3 className="dashboard-stat-card-title">{title}</h3>
        <div className="dashboard-stat-card-bottom">
            <p className="dashboard-stat-card-value">{value}</p>
            <span className="dashboard-stat-card-change">{change}</span>
        </div>
    </div>
);

export default Dashboard;
