import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import './Dashboard.css';

function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const mockData = {
        stats: {
            totalUsers: 1248,
            totalCourses: 45,
            totalInstructors: 12,
            systemUptime: '99.8%'
        },
        userDistribution: [
            { name: 'Học viên', value: 1180, color: '#667eea' },
            { name: 'Giảng viên', value: 58, color: '#10B981' },
            { name: 'Admin', value: 10, color: '#F59E0B' }
        ],
        courseCategories: [
            { category: 'Lập trình', courses: 18, students: 650 },
            { category: 'AI/ML', courses: 12, students: 420 },
            { category: 'Data Science', courses: 8, students: 280 },
            { category: 'DevOps', courses: 7, students: 198 }
        ],
        systemHealth: [
            { metric: 'CPU Usage', value: 45, status: 'good' },
            { metric: 'Memory', value: 62, status: 'good' },
            { metric: 'Storage', value: 78, status: 'warning' },
            { metric: 'API Response', value: 95, status: 'good' }
        ],
        recentActions: [
            { id: 1, action: 'Thêm khóa học mới: Advanced React', user: 'Admin A', time: '1 giờ trước', icon: '➕' },
            { id: 2, action: 'Phê duyệt giảng viên: Nguyễn Văn X', user: 'Admin B', time: '3 giờ trước', icon: '✅' },
            { id: 3, action: 'Xóa tài khoản spam', user: 'Admin A', time: '5 giờ trước', icon: '🗑️' },
            { id: 4, action: 'Cập nhật cấu hình hệ thống', user: 'System', time: '1 ngày trước', icon: '⚙️' }
        ]
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard-loading">Đang tải...</div>;
    }

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="dashboard-main-content">
                <header className="dashboard-header">
                    <div>
                        <h2 className="dashboard-page-title">Dashboard Quản trị</h2>
                        <p className="dashboard-page-subtitle">Tổng quan hệ thống LMS</p>
                    </div>
                    <div className="dashboard-header-right">
                        <span className="dashboard-welcome-text">
                            Xin chào, <strong>{user?.full_name || user?.username}</strong>! 👋
                        </span>
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="dashboard-stats-grid">
                        <AdminStatCard
                            title="Tổng người dùng"
                            value={mockData.stats.totalUsers}
                            change="+124"
                            color="#667eea"
                            icon="👥"
                        />
                        <AdminStatCard
                            title="Tổng khóa học"
                            value={mockData.stats.totalCourses}
                            change="+5"
                            color="#10B981"
                            icon="📚"
                        />
                        <AdminStatCard
                            title="Giảng viên"
                            value={mockData.stats.totalInstructors}
                            change="+2"
                            color="#F59E0B"
                            icon="👨‍🏫"
                        />
                        <AdminStatCard
                            title="System Uptime"
                            value={mockData.stats.systemUptime}
                            change="Stable"
                            color="#764ba2"
                            icon="🖥️"
                        />
                    </div>

                    <div className="dashboard-main-grid">
                        <div className="dashboard-charts-column">
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">👥 Phân bố người dùng</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={mockData.userDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {mockData.userDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">📊 Khóa học theo danh mục</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={mockData.courseCategories}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="category" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="courses" fill="#667eea" name="Khóa học" />
                                        <Bar dataKey="students" fill="#10B981" name="Học viên" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="dashboard-activities-column">
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">💚 Sức khỏe hệ thống</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {mockData.systemHealth.map((item, index) => (
                                        <div key={index} style={styles.healthItem}>
                                            <span style={styles.healthLabel}>{item.metric}</span>
                                            <div style={styles.healthBarContainer}>
                                                <div
                                                    style={{
                                                        ...styles.healthBar,
                                                        width: `${item.value}%`,
                                                        backgroundColor: item.status === 'good' ? '#10B981' : '#F59E0B'
                                                    }}
                                                />
                                            </div>
                                            <span style={styles.healthValue}>{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="dashboard-chart-card" style={{ marginTop: '24px' }}>
                                <h3 className="dashboard-chart-title">📝 Hoạt động gần đây</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {mockData.recentActions.map(action => (
                                        <div key={action.id} style={styles.actionItem}>
                                            <span style={styles.actionIcon}>{action.icon}</span>
                                            <div style={styles.actionInfo}>
                                                <p style={styles.actionText}>{action.action}</p>
                                                <p style={styles.actionUser}>Bởi: {action.user}</p>
                                                <span style={styles.actionTime}>{action.time}</span>
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

const AdminStatCard = ({ title, value, change, color, icon }) => (
    <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ backgroundColor: color }}>
            <span style={{ fontSize: '24px' }}>{icon}</span>
        </div>
        <h3 className="dashboard-stat-card-title">{title}</h3>
        <div className="dashboard-stat-card-bottom">
            <p className="dashboard-stat-card-value">{value}</p>
            <span className="dashboard-stat-card-change">{change}</span>
        </div>
    </div>
);

const styles = {
    healthItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    healthLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2d3748',
        minWidth: '100px'
    },
    healthBarContainer: {
        flex: 1,
        height: '8px',
        backgroundColor: '#e8eaff',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    healthBar: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    healthValue: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#667eea',
        minWidth: '40px',
        textAlign: 'right'
    },
    actionItem: {
        display: 'flex',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e8eaff'
    },
    actionIcon: {
        fontSize: '24px'
    },
    actionInfo: {
        flex: 1
    },
    actionText: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 4px 0'
    },
    actionUser: {
        fontSize: '12px',
        color: '#6B7280',
        margin: '0 0 4px 0'
    },
    actionTime: {
        fontSize: '11px',
        color: '#9CA3AF'
    }
};

export default AdminDashboard;
