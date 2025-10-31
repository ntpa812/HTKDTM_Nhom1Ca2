// smart-lms-frontend/src/pages/LearningPathDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import './LearningPathDetailPage.css'; // File CSS sẽ tạo ở bước tiếp theo

const API_BASE_URL = 'http://localhost:5000/api';

function LearningPathDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [path, setPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPathDetail = async () => {
            setLoading(true);
            try {
                console.log(`Fetching data for id: ${id}`);
                const response = await axios.get(`${API_BASE_URL}/learning-paths/${id}`);
                console.log('API Response:', response.data);
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
        return null; // Hoặc một trang "Không tìm thấy"
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
                            {/* Dữ liệu này nên được thêm vào DB */}
                            <li>✓ Xây dựng ứng dụng web hoàn chỉnh từ đầu đến cuối.</li>
                            <li>✓ Làm chủ React cho Frontend và Node.js cho Backend.</li>
                            <li>✓ Thiết kế và tương tác với cơ sở dữ liệu SQL.</li>
                            <li>✓ Triển khai ứng dụng lên môi trường production.</li>
                        </ul>
                    </div>

                    {/* Course Timeline */}
                    <div className="course-timeline-section">
                        <h3>Lộ trình các khóa học</h3>
                        <div className="course-timeline">
                            {path.courses.map((course, index) => (
                                <div key={course.id} className="timeline-item">
                                    <div className="timeline-connector">
                                        <div className="timeline-dot"></div>
                                        {index < path.courses.length - 1 && <div className="timeline-line"></div>}
                                    </div>
                                    <div className="timeline-content-card">
                                        <p className="course-position">Phần {index + 1}</p>
                                        <h4 className="course-title">{course.title}</h4>
                                        <p className="course-short-desc">{course.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h3>Đánh giá từ học viên</h3>
                        {path.reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-author">
                                    <div className="author-avatar">{review.user.charAt(0)}</div>
                                    <div>
                                        <p className="author-name">{review.user}</p>
                                        <p className="review-date">{review.date}</p>
                                    </div>
                                </div>
                                <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Sidebar --- */}
                <div className="sidebar-detail">
                    <div className="sidebar-card">
                        {/* Mock Image */}
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
                                    <li>Bài tập và dự án thực tế</li>
                                    <li>Chứng chỉ hoàn thành</li>
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
