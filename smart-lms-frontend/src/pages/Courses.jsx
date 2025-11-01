import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Courses.css'; // Import file CSS

function Courses() {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
            const response = await api.get('/courses');
            if (response.data.success && Array.isArray(response.data.data)) {
                setCourses(response.data.data);
            } else {
                setCourses([]);
                setError('Không thể tải danh sách khóa học');
            }
        } catch (error) {
            setCourses([]);
            setError(error.response?.data?.message || 'Lỗi khi tải khóa học');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return 'difficulty-beginner';
            case 'intermediate': return 'difficulty-intermediate';
            case 'advanced': return 'difficulty-advanced';
            default: return 'difficulty-other';
        }
    };

    const getDifficultyText = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return 'Cơ bản';
            case 'intermediate': return 'Trung bình';
            case 'advanced': return 'Nâng cao';
            default: return difficulty || 'N/A';
        }
    };

    const filteredCourses = Array.isArray(courses)
        ? courses.filter(course => {
            if (filter === 'all') return true;
            return course.difficulty?.toLowerCase() === filter;
        })
        : [];

    const getCountByDifficulty = (difficulty) => {
        if (!Array.isArray(courses)) return 0;
        if (difficulty === 'all') return courses.length;
        return courses.filter(c => c.difficulty?.toLowerCase() === difficulty).length;
    };

    if (loading) {
        return (
            <div className="container">
                <Sidebar user={user} onLogout={handleLogout} />
                <main className="main-content">
                    <div className="loading-state">Đang tải khóa học...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content">
                <header className="header">
                    <div>
                        <h2 className="page-title">Khóa học</h2>
                        <p className="page-subtitle">
                            {error ? error : `Khám phá ${courses.length} khóa học chất lượng cao`}
                        </p>
                    </div>
                </header>
                <div className="content">
                    {error ? (
                        <div className="error-state">
                            <p className="error-text">⚠️ {error}</p>
                            <button onClick={loadData} className="retry-btn">Thử lại</button>
                        </div>
                    ) : (
                        <>
                            <div className="filter-container">
                                <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>
                                    Tất cả ({getCountByDifficulty('all')})
                                </button>
                                <button onClick={() => setFilter('beginner')} className={`filter-btn ${filter === 'beginner' ? 'active' : ''}`}>
                                    Cơ bản ({getCountByDifficulty('beginner')})
                                </button>
                                <button onClick={() => setFilter('intermediate')} className={`filter-btn ${filter === 'intermediate' ? 'active' : ''}`}>
                                    Trung bình ({getCountByDifficulty('intermediate')})
                                </button>
                                <button onClick={() => setFilter('advanced')} className={`filter-btn ${filter === 'advanced' ? 'active' : ''}`}>
                                    Nâng cao ({getCountByDifficulty('advanced')})
                                </button>
                            </div>

                            {filteredCourses.length === 0 ? (
                                <div className="empty-state">
                                    <p className="empty-text">
                                        {courses.length === 0 ? '📚 Chưa có khóa học nào' : '🔍 Không tìm thấy khóa học phù hợp'}
                                    </p>
                                </div>
                            ) : (
                                <div className="courses-grid">
                                    {filteredCourses.map((course) => (
                                        <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                                            <div className="course-card">
                                                <div className="course-header">
                                                    <span className={`difficulty-badge ${getDifficultyClass(course.difficulty)}`}>
                                                        {getDifficultyText(course.difficulty)}
                                                    </span>
                                                    <span className="category-badge">{course.category}</span>
                                                </div>
                                                <h3 className="course-title">{course.title}</h3>
                                                <p className="course-description">{course.description || 'Không có mô tả'}</p>
                                                <div className="course-footer">
                                                    <div className="course-info">
                                                        <span className="info-item">⏱️ {course.duration_hours}h</span>
                                                        <span className="info-item">👥 {course.enrolled_count || 0}</span>
                                                    </div>
                                                    <button className="enroll-btn" onClick={(e) => { e.preventDefault(); alert('Đăng ký thành công!'); }}>
                                                        Đăng ký
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Courses;
