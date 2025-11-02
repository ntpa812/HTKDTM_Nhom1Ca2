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

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        stats: null,
        progressData: [],
        knowledgeGapData: [],
        recommendedCourses: [],
        aiPrediction: null
    });

    useEffect(() => {
        loadUserData();
        loadDashboardData();
    }, []);

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
            console.log('🔑 Token:', token); // CHECK TOKEN

            const headers = { Authorization: `Bearer ${token}` };

            console.log('📡 Fetching dashboard data...'); // START FETCH

            const [statsRes, progressRes, knowledgeRes, recommendRes, aiRes] = await Promise.all([
                axios.get('http://localhost:5000/api/dashboard/stats', { headers }),
                axios.get('http://localhost:5000/api/dashboard/progress', { headers }),
                axios.get('http://localhost:5000/api/dashboard/knowledge-gap', { headers }),
                axios.get('http://localhost:5000/api/dashboard/recommendations', { headers }),
                axios.get('http://localhost:5000/api/dashboard/ai-prediction', { headers }) // Gọi API mới
            ]);

            console.log('✅ Stats:', statsRes.data); // CHECK RESPONSE
            console.log('✅ Progress:', progressRes.data);
            console.log('✅ Knowledge Gap:', knowledgeRes.data);
            console.log('✅ Recommendations:', recommendRes.data);

            setDashboardData({
                stats: statsRes.data.data,
                progressData: progressRes.data.data,
                knowledgeGapData: knowledgeRes.data.data,
                recommendedCourses: recommendRes.data.data,
                aiPrediction: aiRes.data.data
            });
        } catch (error) {
            console.error('❌ Error loading dashboard data:', error.response || error);
            // Fallback to mock data...
            if (error.config.url.includes('ai-prediction')) {
                setDashboardData(prev => ({ ...prev, aiPrediction: null }));
            }
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
                            <div className="dashboard-chart-card">
                                <h3 className="dashboard-chart-title">📈 Tiến độ học tập</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={dashboardData.progressData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8eaff" />
                                        <XAxis dataKey="name" stroke="#667eea" />
                                        <YAxis stroke="#667eea" />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="progress" stroke="#667eea" strokeWidth={3} name="Tiến độ (%)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <AIPredictionCard prediction={dashboardData.aiPrediction} />

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
