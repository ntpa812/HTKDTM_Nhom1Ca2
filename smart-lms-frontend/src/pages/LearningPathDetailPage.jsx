import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import PathProgressTracker from '../components/PathProgressTracker';
import './LearningPathDetailPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

function LearningPathDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [path, setPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(true);

    useEffect(() => {
        const fetchPathDetail = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Vui lòng đăng nhập để xem chi tiết.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/learning-paths/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setPath(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Could not load data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPathDetail();
    }, [id]);

    const getStatusIcon = (course) => {
        if (course.isLocked) return '🔒';
        if (course.status === 'completed') return '✅';
        if (course.status === 'in_progress') return '⏳';
        return '🔓';
    };

    if (loading) {
        return (
            <Layout>
                <div className="path-detail-container">
                    <div className="loading-message">Đang tải chi tiết lộ trình học...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="path-detail-container">
                    <div className="error-message">
                        <h2>Rất tiếc, đã có lỗi xảy ra</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/learning')}>Quay lại danh sách</button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!path) {
        return null;
    }

    return (
        <Layout>
            <div className="path-detail-container">
                {/* Back Button */}
                <Link to="/learning" className="back-link">
                    ← Quay lại danh sách lộ trình học
                </Link>

                <div className="path-detail-page">
                    {/* --- Main Content --- */}
                    <div className="main-content">
                        {/* Path Header */}
                        <div className="path-header">
                            <div className="path-category">{path.category}</div>
                            <h1 className="path-title">{path.title}</h1>
                            <p className="path-description">{path.description}</p>
                            <div className="instructor-info-header">
                                Tạo bởi {path.instructor_name}
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="learning-outcomes-box">
                            <h3>Bạn sẽ học được gì?</h3>
                            <ul>
                                <li>✓ Xây dựng ứng dụng web hoàn chỉnh từ đầu đến cuối.</li>
                                <li>✓ Làm chủ React cho Frontend và Node.js cho Backend.</li>
                            </ul>
                        </div>

                        {/* Course Timeline */}
                        <div className="course-timeline-section">
                            <h2>Lộ trình các khóa học</h2>
                            {path.courses.map((course, index) => {
                                const cardClass = `timeline-content-card ${course.isLocked ? 'locked' : ''} ${course.status}`;

                                const CourseCard = () => (
                                    <div className={cardClass}>
                                        <div className="course-header">
                                            <span className="course-position">Phần {course.position}</span>
                                            <span className="course-status-icon">{getStatusIcon(course)}</span>
                                        </div>
                                        <h4 className="course-title">{course.title}</h4>
                                        <p className="course-short-desc">{course.description}</p>
                                        {course.status === 'in_progress' && (
                                            <div className="course-progress-bar">
                                                <div style={{ width: `${course.progress || 0}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <div className="timeline-item" key={course.course_id}>
                                        <div className="timeline-connector">
                                            <div className="timeline-dot"></div>
                                            {index < path.courses.length - 1 && <div className="timeline-line"></div>}
                                        </div>
                                        {!course.isLocked ? (
                                            <Link to={`/courses/${course.course_id}`} className="timeline-card-link">
                                                <CourseCard />
                                            </Link>
                                        ) : (
                                            <CourseCard />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- Sidebar --- */}
                    <div className="sidebar-detail">
                        <div className="sidebar-card">
                            <img src={path.image_url} alt={path.title} className="path-thumbnail" />
                            <div className="sidebar-content">
                                {isEnrolled ? (
                                    <PathProgressTracker pathId={id} courses={path.courses} />
                                ) : (
                                    <>
                                        <button className="enroll-button">Đăng ký ngay</button>
                                        <p className="money-back-guarantee">Đảm bảo hoàn tiền trong 30 ngày</p>
                                    </>
                                )}
                                <div className="path-includes">
                                    <h4>Lộ trình này bao gồm:</h4>
                                    <ul>
                                        <li>⏱️ {path.estimated_hours} giờ học</li>
                                        <li>📚 {path.courses.length} khóa học chi tiết</li>
                                        <li>♾️ Truy cập trọn đời</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default LearningPathDetailPage;
