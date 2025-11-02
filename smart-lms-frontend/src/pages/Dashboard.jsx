import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import AIPredictionCard from '../components/dashboard/AIPredictionCard'; // <-- IMPORT COMPONENT MỚI
import './Dashboard.css';

// Component StatCard giữ nguyên như cũ
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

function Dashboard() {
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null); // Khởi tạo là null
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                // Nếu không có user, điều hướng về trang login
                navigate('/login');
                return;
            }

            await loadDashboardData();
        };

        init();
    }, [navigate]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            console.log('📡 Fetching dashboard data...');

            // --- SỬA LẠI: CHỈ GỌI MỘT API DUY NHẤT ---
            const response = await axios.get('http://localhost:5000/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('✅ Dashboard data received:', response.data);
            setDashboardData(response.data);

        } catch (error) {
            console.error('❌ Error loading dashboard data:', error.response || error);
            if (error.response && error.response.status === 401) {
                navigate('/login'); // Token hết hạn hoặc không hợp lệ
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

    if (loading || !dashboardData) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-loading">Đang tải dữ liệu Dashboard...</div>
            </div>
        );
    }

    // Lấy dữ liệu từ state mới
    const { stats, enrolledCourses, aiPrediction } = dashboardData;

    return (
        <div className="dashboard-container">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="dashboard-main-content">
                <header className="dashboard-header">
                    <div>
                        <h2 className="dashboard-page-title">Bảng điều khiển</h2>
                        <p className="dashboard-page-subtitle">Tổng quan về tiến độ học tập và dự đoán từ AI</p>
                    </div>
                    <div className="dashboard-header-right">
                        <span className="dashboard-welcome-text">
                            Xin chào, <strong>{user?.full_name || user?.username}</strong>! 👋
                        </span>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Thẻ Phân tích từ AI được đưa lên đầu */}
                    <AIPredictionCard prediction={aiPrediction} />

                    <div className="dashboard-stats-grid">
                        <StatCard
                            title="Khóa học đang học"
                            value={stats?.totalEnrolledCourses || "0"}
                            color="#667eea"
                        />
                        <StatCard
                            title="Tiến độ trung bình"
                            value={`${stats?.averageProgress || "0"}%`}
                            color="#10B981"
                        />
                        {/* Các StatCard khác có thể được thêm ở đây */}
                    </div>

                    <div className="dashboard-main-grid">
                        {/* Hiển thị danh sách khóa học đang học */}
                        <div className="dashboard-chart-card">
                            <h3 className="dashboard-chart-title">📚 Các khóa học của bạn</h3>
                            <div className="dashboard-courses-list">
                                {enrolledCourses.length > 0 ? (
                                    enrolledCourses.map((course) => (
                                        <div key={course.ID} className="dashboard-course-item">
                                            <div className="dashboard-course-info">
                                                <h4 className="dashboard-course-title">{course.Title}</h4>
                                                <p className="dashboard-course-difficulty">Tiến độ: {course.Progress}%</p>
                                            </div>
                                            <button className="dashboard-start-btn" onClick={() => navigate(`/courses/${course.ID}`)}>
                                                Tiếp tục học
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Bạn chưa tham gia khóa học nào.</p>
                                )}
                            </div>
                        </div>
                        {/* Các component khác có thể được giữ lại hoặc thay đổi */}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
