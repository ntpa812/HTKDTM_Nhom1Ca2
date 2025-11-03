import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import './Dashboard.css';

// FAKE DATA ADMIN
const FAKE_ADMIN_DATA = {
    stats: {
        activeEnrollments: 1248,
        completedAssignments: 45,
        averageScore: 12,
        totalStudyTime: "99.8%"
    },
    progressData: [
        { date: '2025-10-07', completed: 5, enrolled: 4 },
        { date: '2025-10-10', completed: 4, enrolled: 4 },
        { date: '2025-10-13', completed: 3, enrolled: 2 },
        { date: '2025-10-16', completed: 2, enrolled: 1 },
        { date: '2025-10-19', completed: 1, enrolled: 1 },
        { date: '2025-10-22', completed: 2, enrolled: 2 },
        { date: '2025-10-25', completed: 3, enrolled: 4 },
        { date: '2025-10-28', completed: 4, enrolled: 5 },
        { date: '2025-10-31', completed: 5, enrolled: 4 },
        { date: '2025-11-03', completed: 4, enrolled: 4 }
    ],
    knowledgeGapData: [
        { subject: 'System Health', mastery: 85, gap: 15 },
        { subject: 'User Management', mastery: 78, gap: 22 },
        { subject: 'Course Management', mastery: 92, gap: 8 },
        { subject: 'Analytics', mastery: 88, gap: 12 },
        { subject: 'Performance', mastery: 75, gap: 25 }
    ],
    // USER DISTRIBUTION DATA CHO PIECHART
    userDistribution: [
        { name: 'Học viên', value: 94, color: '#667eea' },
        { name: 'Giảng viên', value: 5, color: '#10B981' },
        { name: 'Admin', value: 1, color: '#F59E0B' }
    ],
    // ADMIN SYSTEM ALERTS
    systemAlerts: [
        {
            id: 1,
            title: "Server Maintenance Required",
            type: "warning",
            priority: "High",
            time: "2 giờ trước"
        },
        {
            id: 2,
            title: "Backup Completed Successfully",
            type: "success",
            priority: "Low",
            time: "5 giờ trước"
        },
        {
            id: 3,
            title: "New Instructor Registration",
            type: "info",
            priority: "Medium",
            time: "1 ngày trước"
        }
    ],
    // ADMIN TASKS
    adminTasks: [
        {
            id: 1,
            title: "Review Pending Course Approvals",
            category: "Content Management",
            priority: "High",
            dueDate: "2025-11-05"
        },
        {
            id: 2,
            title: "System Performance Analysis",
            category: "Infrastructure",
            priority: "Medium",
            dueDate: "2025-11-07"
        },
        {
            id: 3,
            title: "User Feedback Analysis",
            category: "User Experience",
            priority: "Low",
            dueDate: "2025-11-10"
        }
    ]
};

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState(FAKE_ADMIN_DATA);
    const [loading, setLoading] = useState(false);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('30 ngày');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setDashboardData(FAKE_ADMIN_DATA);
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar user={user} />

            <main className="dashboard-main-content">
                <header className="dashboard-header">
                    <div>
                        <h2 className="dashboard-page-title">Dashboard Quản trị</h2>
                        <p className="dashboard-page-subtitle">Tổng quan hệ thống LMS</p>
                    </div>
                    <div className="dashboard-header-right">
                        <span className="dashboard-welcome-text">
                            Xin chào, <strong>{user.full_name || 'Admin'}</strong>! 👋
                        </span>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Section đầu tiên: StatCards (trái) + Admin System Overview (phải) */}
                    <div className="dashboard-header-section">
                        <div className="stats-column">
                            <div className="dashboard-stats-grid">
                                <StatCard
                                    title="Tổng người dùng"
                                    value={dashboardData.stats.activeEnrollments}
                                    change="+124"
                                    color="#667eea"
                                />
                                <StatCard
                                    title="Tổng khóa học"
                                    value={dashboardData.stats.completedAssignments}
                                    change="+5"
                                    color="#10B981"
                                />
                                <StatCard
                                    title="Giảng viên"
                                    value={dashboardData.stats.averageScore}
                                    change="+2"
                                    color="#764ba2"
                                />
                                <StatCard
                                    title="System Uptime"
                                    value={dashboardData.stats.totalStudyTime}
                                    change="Stable"
                                    color="#F59E0B"
                                />
                            </div>
                        </div>

                        <div className="ai-column">
                            <AdminSystemCard userDistribution={dashboardData.userDistribution} />
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="dashboard-main-grid">
                        <div className="dashboard-charts-column">
                            <div className="dashboard-chart-card">
                                <div className="time-period-selector">
                                    <h3>📈 Xu hướng hệ thống</h3>
                                    <div className="time-period-buttons">
                                        {['7 ngày', '30 ngày', '90 ngày'].map(period => (
                                            <button
                                                key={period}
                                                className={`time-btn ${selectedTimePeriod === period ? 'active' : ''}`}
                                                onClick={() => setSelectedTimePeriod(period)}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={dashboardData.progressData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="completed"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            name="Hoàn thành"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="enrolled"
                                            stroke="#667eea"
                                            strokeWidth={3}
                                            name="Đăng ký mới"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">📊 Hiệu suất hệ thống</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={dashboardData.knowledgeGapData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="subject" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="mastery" fill="#10B981" name="Hiệu suất" />
                                        <Bar dataKey="gap" fill="#F59E0B" name="Cần cải thiện" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="dashboard-activities-column">
                            {/* System Alerts thay cho Deadlines */}
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">🚨 Cảnh báo hệ thống</h3>
                                <div className="admin-alerts-list">
                                    {dashboardData.systemAlerts.map(alert => (
                                        <div key={alert.id} className={`admin-alert-item ${alert.type}`}>
                                            <div className="admin-alert-icon">
                                                {alert.type === 'warning' ? '⚠️' :
                                                    alert.type === 'success' ? '✅' :
                                                        alert.type === 'info' ? 'ℹ️' : '🔔'}
                                            </div>
                                            <div className="admin-alert-content">
                                                <div className="admin-alert-title">{alert.title}</div>
                                                <div className="admin-alert-meta">
                                                    <span className={`admin-alert-priority ${alert.priority.toLowerCase()}`}>
                                                        {alert.priority}
                                                    </span>
                                                    <span className="admin-alert-time">{alert.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Tasks thay cho Recommended Actions */}
                            <div className="dashboard-recommend-card">
                                <h3 className="dashboard-recommend-title">📋 Nhiệm vụ quản trị</h3>
                                <div className="dashboard-courses-list">
                                    {dashboardData.adminTasks.map(task => (
                                        <div key={task.id} className="dashboard-course-item">
                                            <div className="dashboard-course-info">
                                                <h4 className="dashboard-course-title">{task.title}</h4>
                                                <p className="dashboard-course-difficulty">
                                                    Danh mục: {task.category}
                                                </p>
                                            </div>
                                            <div className="dashboard-course-actions">
                                                <div className="dashboard-match-info">
                                                    <p className="dashboard-match-label">Ưu tiên</p>
                                                    <p className={`dashboard-match-value ${task.priority.toLowerCase()}`}>
                                                        {task.priority}
                                                    </p>
                                                </div>
                                                <button className="dashboard-start-btn">
                                                    Xử lý
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// StatCard Y HỆT Dashboard sinh viên
const StatCard = ({ title, value, change, color }) => (
    <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ backgroundColor: color }}>
            <svg className="dashboard-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        </div>
        <h3 className="dashboard-stat-card-title">{title}</h3>
        <div className="dashboard-stat-card-bottom">
            <p className="dashboard-stat-card-value">{value}</p>
            <span className="dashboard-stat-card-change">{change}</span>
        </div>
    </div>
);

// ADMIN SYSTEM CARD với PieChart phù hợp context admin
const AdminSystemCard = ({ userDistribution }) => (
    <div className="ai-card">
        <div className="ai-card-title">
            🤖 Phân bố người dùng hệ thống
        </div>
        <div className="ai-card-content">
            <div className="ai-prediction-chart">
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={userDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={85}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {userDistribution.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="ai-prediction-summary">
                <p className="ai-summary-label">Thống kê tổng quan:</p>
                <h3 className="ai-summary-grade" style={{ color: '#667eea' }}>
                    Hoạt động tốt
                </h3>
                <p className="ai-summary-cluster">Hệ thống ổn định</p>
                <p className="ai-summary-advice">
                    Hệ thống đang hoạt động bình thường với {userDistribution[0]?.value}% học viên hoạt động tích cực.
                </p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
