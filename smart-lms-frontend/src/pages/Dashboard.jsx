import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mock data (giữ nguyên)
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
            <div style={styles.container}>
                <div style={styles.loading}>Đang tải...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Sidebar Component */}
            <Sidebar user={user} onLogout={handleLogout} />

            {/* Main Content - giữ nguyên code cũ */}
            <main style={styles.mainContent}>
                {/* Header */}
                <header style={styles.header}>
                    <div>
                        <h2 style={styles.pageTitle}>Dashboard</h2>
                        <p style={styles.pageSubtitle}>Tổng quan về tiến độ học tập của bạn</p>
                    </div>
                    <div style={styles.headerRight}>
                        <span style={styles.welcomeText}>
                            Xin chào, <strong>{user?.full_name || user?.username}</strong>! 👋
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div style={styles.content}>
                    {/* Stats Cards */}
                    <div style={styles.statsGrid}>
                        <StatCard title="Khóa học đang học" value="5" change="+2" color="#667eea" />
                        <StatCard title="Bài tập hoàn thành" value="24" change="+8" color="#10B981" />
                        <StatCard title="Điểm trung bình" value="8.5" change="+0.3" color="#764ba2" />
                        <StatCard title="Thời gian học" value="42h" change="+12h" color="#F59E0B" />
                    </div>

                    {/* Charts */}
                    <div style={styles.chartsGrid}>
                        <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>📈 Tiến độ học tập</h3>
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

                        <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>🎯 Phân tích lỗ hổng kiến thức</h3>
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
                    </div>

                    {/* Recommended Courses */}
                    <div style={styles.recommendCard}>
                        <h3 style={styles.recommendTitle}>🤖 Khóa học được đề xuất (AI)</h3>
                        <div style={styles.coursesList}>
                            {recommendedCourses.map((course) => (
                                <div key={course.id} style={styles.courseItem}>
                                    <div style={styles.courseInfo}>
                                        <h4 style={styles.courseTitle}>{course.title}</h4>
                                        <p style={styles.courseDifficulty}>Độ khó: {course.difficulty}</p>
                                    </div>
                                    <div style={styles.courseActions}>
                                        <div style={styles.matchInfo}>
                                            <p style={styles.matchLabel}>Độ phù hợp</p>
                                            <p style={styles.matchValue}>{course.match}%</p>
                                        </div>
                                        <button style={styles.startBtn}>Bắt đầu học</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// StatCard Component - giữ nguyên
const StatCard = ({ title, value, change, color }) => (
    <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, backgroundColor: color }}>
            <svg style={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        <h3 style={styles.statCardTitle}>{title}</h3>
        <div style={styles.statCardBottom}>
            <p style={styles.statCardValue}>{value}</p>
            <span style={styles.statCardChange}>{change}</span>
        </div>
    </div>
);

// Styles - giữ nguyên tất cả styles cũ (bỏ qua sidebar styles vì đã move sang component)
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f5f7fa',
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        color: '#667eea',
        fontSize: '24px',
        fontWeight: '600'
    },
    mainContent: {
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        background: 'white',
        padding: '32px 40px',
        borderBottom: '2px solid #e8eaff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pageTitle: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    pageSubtitle: {
        color: '#6c757d',
        fontSize: '14px',
        margin: 0
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    welcomeText: {
        color: '#6c757d',
        fontSize: '15px'
    },
    content: {
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto'
    },
    // ... giữ nguyên tất cả các styles còn lại từ code cũ
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
    },
    statCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '2px solid #e8eaff'
    },
    statIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
    },
    iconSvg: {
        width: '24px',
        height: '24px',
        color: 'white'
    },
    statCardTitle: {
        color: '#6c757d',
        fontSize: '14px',
        fontWeight: '500',
        margin: '0 0 8px 0'
    },
    statCardBottom: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    statCardValue: {
        color: '#2d3748',
        fontSize: '32px',
        fontWeight: '700',
        margin: 0
    },
    statCardChange: {
        color: '#10B981',
        fontSize: '14px',
        fontWeight: '600'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    chartCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '2px solid #e8eaff'
    },
    chartTitle: {
        color: '#667eea',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px'
    },
    recommendCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '2px solid #e8eaff'
    },
    recommendTitle: {
        color: '#667eea',
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '20px'
    },
    coursesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    courseItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        border: '2px solid #e8eaff',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
    },
    courseInfo: {
        flex: 1
    },
    courseTitle: {
        color: '#2d3748',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 4px 0'
    },
    courseDifficulty: {
        color: '#6c757d',
        fontSize: '14px',
        margin: 0
    },
    courseActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
    },
    matchInfo: {
        textAlign: 'right'
    },
    matchLabel: {
        color: '#6c757d',
        fontSize: '13px',
        margin: '0 0 4px 0'
    },
    matchValue: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '20px',
        fontWeight: '700',
        margin: 0
    },
    startBtn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};

export default Dashboard;
