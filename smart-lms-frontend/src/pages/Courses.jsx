import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout'; // Dùng Layout như các trang khác
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Courses.css';

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

    const filteredCourses = courses.filter((course) => {
        if (filter === 'all') return true;
        return course.difficulty?.toLowerCase() === filter.toLowerCase();
    });

    const getDifficultyClass = (difficulty) => {
        const normalizedDifficulty = difficulty?.toLowerCase() || 'other';
        if (normalizedDifficulty === 'beginner') return 'difficulty-beginner';
        if (normalizedDifficulty === 'intermediate') return 'difficulty-intermediate';
        if (normalizedDifficulty === 'advanced') return 'difficulty-advanced';
        return 'difficulty-other';
    };

    return (
        <Layout title="Khóa học" subtitle="Khám phá và đăng ký các khóa học chất lượng cao">
            <div className="courses-page">
                {/* Content */}
                <div className="content">
                    {loading && (
                        <div className="loading-state">
                            <div className="loading-spinner">⏳</div>
                            <p>Đang tải khóa học...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-state">
                            <p className="error-text">{error}</p>
                            <button className="retry-btn" onClick={loadData}>
                                Thử lại
                            </button>
                        </div>
                    )}

                    {!loading && !error && courses.length === 0 && (
                        <div className="empty-state">
                            <p className="empty-text">Không có khóa học nào</p>
                        </div>
                    )}

                    {!loading && !error && courses.length > 0 && (
                        <>
                            {/* Filter */}
                            <div className="filter-container">
                                <button
                                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    Tất cả ({courses.length})
                                </button>
                                <button
                                    className={`filter-btn ${filter === 'beginner' ? 'active' : ''}`}
                                    onClick={() => setFilter('beginner')}
                                >
                                    Beginner ({courses.filter((c) => c.difficulty?.toLowerCase() === 'beginner').length})
                                </button>
                                <button
                                    className={`filter-btn ${filter === 'intermediate' ? 'active' : ''}`}
                                    onClick={() => setFilter('intermediate')}
                                >
                                    Intermediate ({courses.filter((c) => c.difficulty?.toLowerCase() === 'intermediate').length})
                                </button>
                                <button
                                    className={`filter-btn ${filter === 'advanced' ? 'active' : ''}`}
                                    onClick={() => setFilter('advanced')}
                                >
                                    Advanced ({courses.filter((c) => c.difficulty?.toLowerCase() === 'advanced').length})
                                </button>
                            </div>

                            {/* Courses Grid */}
                            <div className="courses-grid">
                                {filteredCourses.map((course) => (
                                    <Link to={`/courses/${course.id}`} key={course.id} className="course-card-link">
                                        <div className="course-card">
                                            <div className="course-header">
                                                <span className={`difficulty-badge ${getDifficultyClass(course.difficulty)}`}>
                                                    {course.difficulty || 'N/A'}
                                                </span>
                                                <span className="category-badge">{course.category_name || 'Khác'}</span>
                                            </div>
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-description">{course.description}</p>
                                            <div className="course-footer">
                                                <div className="course-info">
                                                    <span className="info-item">⏱️ {course.duration_hours || 0}h</span>
                                                    <span className="info-item">👥 {course.enrolled_count || 0}</span>
                                                </div>
                                                <button className="enroll-btn">Xem chi tiết</button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Courses;
