// src/components/PathProgressTracker.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PathProgressTracker.css';

const API_BASE_URL = 'http://localhost:5000/api';

function PathProgressTracker({ pathId }) {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem('token');
            if (!token || !pathId) return;

            try {
                const response = await axios.get(`${API_BASE_URL}/learning-paths/${pathId}/my-progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setProgress(response.data.data);
                }
            } catch (error) {
                console.error("Không thể tải tiến độ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [pathId]);

    if (loading) {
        return <div className="progress-tracker-loading">Đang tải tiến độ...</div>;
    }

    if (!progress) {
        return null; // Không hiển thị gì nếu không có dữ liệu tiến độ
    }

    return (
        <div className="path-progress-tracker-card">
            <h4>Tiến độ của bạn</h4>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.overallCompletion}%` }}
                ></div>
            </div>
            <p className="progress-percentage">{progress.overallCompletion}% Hoàn thành</p>

            <div className="progress-stats">
                <div className="stat-item">
                    <span className="stat-value">{progress.coursesCompleted} / {progress.totalCourses}</span>
                    <span className="stat-label">Khóa học</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{(progress.totalTimeSpent / 60).toFixed(1)}</span>
                    <span className="stat-label">Giờ học</span>
                </div>
            </div>
        </div>
    );
}

export default PathProgressTracker;
