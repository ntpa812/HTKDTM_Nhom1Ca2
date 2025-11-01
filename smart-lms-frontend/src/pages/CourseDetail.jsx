import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/layout/Sidebar'; // Import Sidebar
import './CourseDetail.css'; // Import file CSS mới

const API_BASE_URL = 'http://localhost:5000/api';

function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Yêu cầu đăng nhập.');

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${API_BASE_URL}/courses/${id}`, config);

                if (response.data.success) {
                    setCourse(response.data.data);
                    // Mặc định chọn bài học đầu tiên để hiển thị
                    if (response.data.data.lessons && response.data.data.lessons.length > 0) {
                        setActiveLesson(response.data.data.lessons[0]);
                    }
                } else {
                    throw new Error(response.data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    // Placeholder cho user, bạn có thể lấy từ localStorage hoặc context
    const user = JSON.parse(localStorage.getItem('user'));

    if (loading) {
        return (
            <div className="page-container">
                <Sidebar user={user} />
                <main className="main-content-area">
                    <div className="loading-message">Đang tải nội dung khóa học...</div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <Sidebar user={user} />
                <main className="main-content-area">
                    <div className="error-message">Lỗi: {error}</div>
                </main>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="page-container">
                <Sidebar user={user} />
                <main className="main-content-area">
                    <div className="error-message">Không tìm thấy khóa học.</div>
                </main>
            </div>
        );
    }

    const totalLessons = course.lessons?.length || 0;
    const completedLessons = course.lessons?.filter(l => l.status === 'completed').length || 0;
    const courseProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return (
        <div className="page-container">
            <Sidebar user={user} />
            <main className="main-content-area">
                <div className="course-detail-header">
                    <Link to="/courses" className="back-link">← Quay lại danh sách khóa học</Link>
                    <h1>{course.title}</h1>
                    <p className="instructor-info">Giảng viên: {course.instructor_name}</p>
                    <div className="course-progress-bar">
                        <div className="progress-fill" style={{ width: `${courseProgress}%` }}></div>
                    </div>
                    <span className="progress-text">{courseProgress.toFixed(0)}% Hoàn thành</span>
                </div>

                <div className="course-detail-body">
                    <div className="lesson-content-area">
                        <h2>{activeLesson ? activeLesson.title : 'Chọn một bài học'}</h2>
                        <div className="video-player-placeholder">
                            <p>▶️</p>
                            <span>Nội dung video bài học sẽ hiển thị ở đây</span>
                        </div>
                        <div className="lesson-description">
                            <p>{activeLesson?.description || 'Chưa có mô tả cho bài học này.'}</p>
                        </div>
                    </div>

                    <div className="lessons-sidebar">
                        <h4>Nội dung khóa học</h4>
                        <ul className="lessons-list-panel">
                            {course.lessons.map((lesson, index) => (
                                <li
                                    key={lesson.id}
                                    className={`lesson-item-panel ${activeLesson?.id === lesson.id ? 'active' : ''}`}
                                    onClick={() => setActiveLesson(lesson)}
                                >
                                    <span className="lesson-index">{index + 1}</span>
                                    <div className="lesson-details">
                                        <p className="lesson-title">{lesson.title}</p>
                                        <span className="lesson-duration">
                                            🕒 {lesson.duration_minutes} phút
                                        </span>
                                    </div>
                                    {lesson.is_preview_allowed && <span className="preview-tag">Xem trước</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CourseDetail;
