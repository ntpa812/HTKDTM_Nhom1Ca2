import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import './Dashboard.css';

function InstructorDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mock data - sẽ thay bằng API sau
    const mockData = {
        stats: {
            totalCourses: 8,
            totalStudents: 156,
            averageCompletion: 73.5,
            totalRevenue: '45.2M'
        },
        enrollmentTrend: [
            { month: 'T1', students: 120 },
            { month: 'T2', students: 135 },
            { month: 'T3', students: 145 },
            { month: 'T4', students: 156 }
        ],
        coursePerformance: [
            { course: 'React JS', completion: 85, students: 45 },
            { course: 'Node.js', completion: 72, students: 38 },
            { course: 'Python', completion: 68, students: 42 },
            { course: 'MongoDB', completion: 79, students: 31 }
        ],
        recentActivity: [
            { id: 1, student: 'Nguyễn Văn A', action: 'Hoàn thành khóa React JS', time: '2 giờ trước', icon: '✅' },
            { id: 2, student: 'Trần Thị B', action: 'Đăng ký khóa Node.js', time: '5 giờ trước', icon: '📝' },
            { id: 3, student: 'Lê Văn C', action: 'Hỏi đáp trong Discussion', time: '1 ngày trước', icon: '💬' },
            { id: 4, student: 'Phạm Thị D', action: 'Hoàn thành Quiz Python', time: '1 ngày trước', icon: '🎯' }
        ],
        topPerformers: [
            { id: 1, name: 'Nguyễn Văn A', score: 95, courses: 5, avatar: '👨' },
            { id: 2, name: 'Trần Thị B', score: 92, courses: 4, avatar: '👩' },
            { id: 3, name: 'Lê Văn C', score: 88, courses: 6, avatar: '👨' }
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
                        <h2 className="dashboard-page-title">Dashboard Giảng viên</h2>
                        <p className="dashboard-page-subtitle">Quản lý khóa học và học viên của bạn</p>
                    </div>
                    <div className="dashboard-header-right">
                        <span className="dashboard-welcome-text">
                            Xin chào, <strong>{user?.full_name || user?.username}</strong>! 👋
                        </span>
                    </div>
                </header>
                {/* 
                <button
                    onClick={() => navigate('/instructor/learning-paths')}
                    className="nav-item"
                >
                    📚 Manage Learning Paths
                </button> */}

                <div className="dashboard-content">
                    {/* Stats Cards */}
                    <div className="dashboard-stats-grid">
                        <InstructorStatCard
                            title="Tổng khóa học"
                            value={mockData.stats.totalCourses}
                            change="+2"
                            color="#667eea"
                            icon="📚"
                        />
                        <InstructorStatCard
                            title="Tổng học viên"
                            value={mockData.stats.totalStudents}
                            change="+23"
                            color="#F59E0B"
                            icon="👨‍🎓"
                        />
                        <InstructorStatCard
                            title="Tỷ lệ hoàn thành TB"
                            value={mockData.stats.averageCompletion + '%'}
                            change="+5.2%"
                            color="#10B981"
                            icon="✅"
                        />
                    </div>

                    <div className="dashboard-main-grid">
                        <div className="dashboard-charts-column">
                            {/* Enrollment Trend */}
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">📈 Xu hướng đăng ký học viên</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={mockData.enrollmentTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="month" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="students" stroke="#667eea" strokeWidth={3} name="Học viên" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Course Performance */}
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">📊 Hiệu suất khóa học</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={mockData.coursePerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="course" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="completion" fill="#10B981" name="Hoàn thành (%)" />
                                        <Bar dataKey="students" fill="#667eea" name="Học viên" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="dashboard-activities-column">
                            {/* Recent Activity */}
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">🔔 Hoạt động gần đây</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {mockData.recentActivity.map(activity => (
                                        <div key={activity.id} style={styles.activityItem}>
                                            <span style={styles.activityIcon}>{activity.icon}</span>
                                            <div style={styles.activityInfo}>
                                                <p style={styles.activityStudent}>{activity.student}</p>
                                                <p style={styles.activityAction}>{activity.action}</p>
                                                <span style={styles.activityTime}>{activity.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Performers */}
                            <div className="dashboard-chart-card" style={{ marginTop: '24px' }}>
                                <h3 className="dashboard-chart-title">🏆 Học viên xuất sắc</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {mockData.topPerformers.map((student, index) => (
                                        <div key={student.id} style={styles.performerItem}>
                                            <div style={styles.performerRank}>#{index + 1}</div>
                                            <span style={styles.performerAvatar}>{student.avatar}</span>
                                            <div style={styles.performerInfo}>
                                                <p style={styles.performerName}>{student.name}</p>
                                                <p style={styles.performerStats}>
                                                    Điểm: {student.score} | {student.courses} khóa học
                                                </p>
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

const InstructorStatCard = ({ title, value, change, color, icon }) => (
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
    activityItem: {
        display: 'flex',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e8eaff'
    },
    activityIcon: {
        fontSize: '24px'
    },
    activityInfo: {
        flex: 1
    },
    activityStudent: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 4px 0'
    },
    activityAction: {
        fontSize: '13px',
        color: '#6B7280',
        margin: '0 0 4px 0'
    },
    activityTime: {
        fontSize: '11px',
        color: '#9CA3AF'
    },
    performerItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e8eaff'
    },
    performerRank: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#667eea',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px'
    },
    performerAvatar: {
        fontSize: '32px'
    },
    performerInfo: {
        flex: 1
    },
    performerName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 4px 0'
    },
    performerStats: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0
    }
};

export default InstructorDashboard;
