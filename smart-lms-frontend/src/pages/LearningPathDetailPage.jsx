import React, { useState, useEffect } from 'react';
// SỬA LỖI: Thêm 'Link' vào import
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import './LearningPathDetailPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

function LearningPathDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [path, setPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // SỬA LỖI: Định nghĩa hàm getStatusIcon
    const getStatusIcon = (course) => {
        if (course.isLocked) return '🔒';
        if (course.status === 'completed') return '✅';
        if (course.status === 'in_progress') return '⏳';
        return '🔓';
    };

    if (loading) {
        return (
            <Layout>
                <div className="detail-loading-container">
                    <div className="detail-loading-spinner"></div>
                    <p>Đang tải chi tiết lộ trình học...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="detail-error-container">
                    <h2>Rất tiếc, đã có lỗi xảy ra</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/learning')}>Quay lại danh sách</button>
                </div>
            </Layout>
        );
    }

    if (!path) {
        return null;
    }

    return (
        <Layout>
            <div className="path-detail-page">
                {/* --- Main Content --- */}
                <div className="main-content">
                    {/* Path Header */}
                    <div className="path-header">
                        <p className="path-category">{path.category}</p>
                        <h1 className="path-title">{path.title}</h1>
                        <p className="path-description">{path.description}</p>
                        <div className="instructor-info-header">
                            <img src={path.instructor_avatar || '/default-avatar.png'} alt={path.instructor_name} />
                            <span>Tạo bởi <strong>{path.instructor_name}</strong></span>
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
                        <h3>Lộ trình các khóa học</h3>
                        <div className="course-timeline">
                            {path.courses.map((course, index) => {
                                const cardClass = `timeline-content-card ${course.isLocked ? 'locked' : ''} ${course.status}`;

                                const CourseCard = () => (
                                    <div className={cardClass}>
                                        <div className="course-header">
                                            <p className="course-position">Phần {course.position}</p>
                                            <span className="course-status-icon">{getStatusIcon(course)}</span>
                                        </div>
                                        <h4 className="course-title">{course.title}</h4>
                                        <p className="course-short-desc">{course.description}</p>
                                        {course.status === 'in_progress' && (
                                            <div className="course-progress-bar">
                                                <div style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <div key={course.id} className="timeline-item">
                                        <div className="timeline-connector">
                                            <div className="timeline-dot"></div>
                                            {index < path.courses.length - 1 && <div className="timeline-line"></div>}
                                        </div>
                                        {!course.isLocked ? (
                                            <Link to={`/courses/${course.id}`} className="timeline-card-link">
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
                </div>

                {/* --- Sidebar --- */}
                <div className="sidebar-detail">
                    <div className="sidebar-card">
                        <img className="path-thumbnail" src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800" alt={path.title} />
                        <div className="sidebar-content">
                            <button className="enroll-button">Đăng ký ngay</button>
                            <p className="money-back-guarantee">Đảm bảo hoàn tiền trong 30 ngày</p>
                            <div className="path-includes">
                                <h4>Lộ trình này bao gồm:</h4>
                                <ul>
                                    <li><strong>{path.estimated_hours}</strong> giờ học</li>
                                    <li><strong>{path.courses.length}</strong> khóa học chi tiết</li>
                                    <li>Truy cập trọn đời</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default LearningPathDetailPage;

