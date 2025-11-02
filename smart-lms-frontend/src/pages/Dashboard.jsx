import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import RecentActivities from '../components/dashboard/RecentActivities';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import AIPredictionCard from '../components/dashboard/AIPredictionCard';
import './Dashboard.css';

// === FAKE DATA CHO DASHBOARD ===
const FAKE_DASHBOARD_DATA = {
    stats: {
        activeEnrollments: 4,
        completedAssignments: 23,
        averageScore: 8.2,
        totalStudyTime: "42h"
    },
    progressData: [
        { name: 'Tuần 1', progress: 20 },
        { name: 'Tuần 2', progress: 35 },
        { name: 'Tuần 3', progress: 45 },
        { name: 'Tuần 4', progress: 60 },
        { name: 'Tuần 5', progress: 67 }
    ],
    knowledgeGapData: [
        { subject: 'JavaScript', mastery: 85, gap: 15 },
        { subject: 'React', mastery: 70, gap: 30 },
        { subject: 'Node.js', mastery: 60, gap: 40 },
        { subject: 'Database', mastery: 45, gap: 55 },
        { subject: 'DevOps', mastery: 30, gap: 70 }
    ],
    recommendedCourses: [
        {
            id: 1,
            title: "Advanced React Patterns",
            difficulty: "Nâng cao",
            match: 92
        },
        {
            id: 2,
            title: "Node.js Microservices",
            difficulty: "Trung bình",
            match: 88
        },
        {
            id: 3,
            title: "MongoDB Deep Dive",
            difficulty: "Nâng cao",
            match: 85
        }
    ],
    aiPrediction: {
        status: 'success',
        cluster: 2,
        predicted_grade: 'Khá',
        probabilities: {
            'Giỏi': 0.15,
            'Khá': 0.65,
            'Trung bình': 0.18,
            'Yếu': 0.02
        },
        recommendations: [
            "Bạn thuộc nhóm học viên có hiệu suất tốt",
            "Nên tập trung vào các bài tập thực hành nhiều hơn",
            "Có thể thử thách bản thân với các khóa học nâng cao"
        ]
    }
};

// === LEARNING PATH ANALYTICS TIME SERIES ===
// Component CustomTooltip từ Analytics
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Ngày: ${label}`}</p>
                {payload.map((p, idx) => (
                    <p key={idx} className="intro" style={{ color: p.color }}>
                        {`${p.name}: ${p.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Component TimeSeriesChart từ Analytics (tái sử dụng)
const TimeSeriesChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#667eea" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#667eea" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
                type="monotone"
                dataKey="new_enrollments"
                name="Đăng ký mới"
                stroke="#8884d8"
                activeDot={{ r: 6 }}
            />
            <Line
                type="monotone"
                dataKey="new_completions"
                name="Hoàn thành"
                stroke="#10B981"
            />
        </LineChart>
    </ResponsiveContainer>
);

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // State từ code cũ - giữ nguyên
    const [dashboardData, setDashboardData] = useState({
        stats: null,
        progressData: [],
        knowledgeGapData: [],
        recommendedCourses: [],
        aiPrediction: null
    });

    // State mới cho Learning Path Analytics Time Series
    const [timePeriod, setTimePeriod] = useState(30);
    const [timeSeriesData, setTimeSeriesData] = useState([]);

    // Hàm tạo fake time series data
    const buildFakeTimeSeries = (days) => {
        const today = new Date();
        return Array.from({ length: days }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (days - 1 - i));
            const date = d.toISOString().substring(0, 10);

            // Tạo dữ liệu fake có chút dao động tự nhiên
            const baseEnroll = 5 + Math.round(3 * Math.sin(i / 3));
            const baseComplete = 3 + Math.round(2 * Math.cos(i / 4));

            return {
                date,
                new_enrollments: Math.max(0, baseEnroll),
                new_completions: Math.max(0, baseComplete)
            };
        });
    };

    useEffect(() => {
        loadUserData();
        loadDashboardData();
    }, []);

    // Effect để cập nhật time series data khi timePeriod thay đổi
    useEffect(() => {
        setTimeSeriesData(buildFakeTimeSeries(timePeriod));
    }, [timePeriod]);

    const loadUserData = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔑 Token:', token);

            // Kiểm tra token trước khi gọi API
            if (!token) {
                navigate('/login');
                return;
            }

            console.log('📡 Sử dụng fake data cho dashboard...');

            // Simulate loading time
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Sử dụng fake data thay vì gọi API
            setDashboardData(FAKE_DASHBOARD_DATA);

        } catch (error) {
            console.error('❌ Error loading dashboard data:', error.response || error);
            // Fallback to fake data
            setDashboardData(FAKE_DASHBOARD_DATA);
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
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="dashboard-main-content">
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

                <div className="dashboard-content">
                    {/* AI Prediction Card - Thêm vào đầu */}
                    {dashboardData.aiPrediction && (
                        <AIPredictionCard prediction={dashboardData.aiPrediction} />
                    )}

                    <div className="dashboard-stats-grid">
                        <StatCard
                            title="Khóa học đang học"
                            value={dashboardData.stats?.activeEnrollments || "0"}
                            change="+2"
                            color="#667eea"
                        />
                        <StatCard
                            title="Bài tập hoàn thành"
                            value={dashboardData.stats?.completedAssignments || "0"}
                            change="+8"
                            color="#10B981"
                        />
                        <StatCard
                            title="Điểm trung bình"
                            value={dashboardData.stats?.averageScore || "0"}
                            change="+0.3"
                            color="#764ba2"
                        />
                        <StatCard
                            title="Thời gian học"
                            value={dashboardData.stats?.totalStudyTime || "0h"}
                            change="+12h"
                            color="#F59E0B"
                        />
                    </div>

                    <div className="dashboard-main-grid">
                        <div className="dashboard-charts-column">
                            {/* THAY ĐỔI: Tiến độ học tập -> Hoạt động học tập theo thời gian (Learning Path Analytics) */}
                            <div className="dashboard-chart-card">
                                <div className="time-period-selector">
                                    <h3 className="dashboard-chart-title">📈 Hoạt động học tập theo thời gian</h3>
                                    <div className="time-period-buttons">
                                        {[7, 30, 90].map(period => (
                                            <button
                                                key={period}
                                                className={`time-btn ${timePeriod === period ? 'active' : ''}`}
                                                onClick={() => setTimePeriod(period)}
                                            >
                                                {period} ngày
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Badge demo data */}
                                <div className="demo-badge">
                                    {/* <span className="demo-text">📊 Demo Data</span> */}
                                </div>

                                <TimeSeriesChart data={timeSeriesData} />
                            </div>
                            {/* 
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">🎯 Phân tích lỗ hổng kiến thức</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={dashboardData.knowledgeGapData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="subject" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="mastery" fill="#10B981" name="Mức độ thành thạo" />
                                        <Bar dataKey="gap" fill="#EF4444" name="Lỗ hổng" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div> */}

                            <PerformanceMetrics />
                        </div>

                        <div className="dashboard-activities-column">
                            <UpcomingDeadlines />

                            <div className="dashboard-recommend-card">
                                <h3 className="dashboard-recommend-title">🤖 Khóa học được đề xuất (AI)</h3>
                                <div className="dashboard-courses-list">
                                    {dashboardData.recommendedCourses.map((course) => (
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

                            <RecentActivities />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

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