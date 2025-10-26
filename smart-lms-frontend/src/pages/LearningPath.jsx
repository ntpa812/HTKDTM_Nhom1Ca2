// smart-lms-frontend/src/pages/LearningPath.jsx (cho Student)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

function LearningPath() {
    const navigate = useNavigate();
    const [learningPaths, setLearningPaths] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Mock learning paths available for students
        setLearningPaths([
            {
                id: 1,
                title: "Full-Stack Web Development",
                description: "Lộ trình từ Frontend đến Backend với React và Node.js",
                category: "Web Development",
                difficulty: "Intermediate",
                coursesCount: 6,
                enrolledCount: 124,
                estimatedHours: 180,
                isEnrolled: true,
                progress: 65,
                instructor: "Dr. Nguyễn Văn Minh"
            },
            {
                id: 2,
                title: "Data Science Fundamentals",
                description: "Nền tảng Data Science với Python và Machine Learning",
                category: "Data Science",
                difficulty: "Beginner",
                coursesCount: 8,
                enrolledCount: 89,
                estimatedHours: 220,
                isEnrolled: false,
                progress: 0,
                instructor: "ThS. Trần Thị Hương"
            },
            {
                id: 3,
                title: "AI & Machine Learning Advanced",
                description: "Khóa học nâng cao về AI và Machine Learning",
                category: "AI/ML",
                difficulty: "Advanced",
                coursesCount: 12,
                enrolledCount: 45,
                estimatedHours: 350,
                isEnrolled: false,
                progress: 0,
                instructor: "TS. Lê Hoàng Nam"
            }
        ]);
    }, []);

    const filteredPaths = learningPaths.filter(path => {
        switch (filter) {
            case 'enrolled': return path.isEnrolled;
            case 'available': return !path.isEnrolled;
            default: return true;
        }
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return '#10b981';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const handleEnroll = (pathId) => {
        setLearningPaths(paths =>
            paths.map(path =>
                path.id === pathId
                    ? { ...path, isEnrolled: true, enrolledCount: path.enrolledCount + 1 }
                    : path
            )
        );
    };

    return (
        <Layout title="Learning Paths" subtitle="Khám phá lộ trình học tập có cấu trúc">
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.pageTitle}>📚 Learning Paths</h2>
                        <p style={styles.pageSubtitle}>
                            Theo dõi lộ trình học tập có cấu trúc để phát triển kỹ năng một cách hiệu quả
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={styles.filterTabs}>
                    <button
                        style={{ ...styles.tab, ...(filter === 'all' ? styles.activeTab : {}) }}
                        onClick={() => setFilter('all')}
                    >
                        Tất cả ({learningPaths.length})
                    </button>
                    <button
                        style={{ ...styles.tab, ...(filter === 'enrolled' ? styles.activeTab : {}) }}
                        onClick={() => setFilter('enrolled')}
                    >
                        Đã đăng ký ({learningPaths.filter(p => p.isEnrolled).length})
                    </button>
                    <button
                        style={{ ...styles.tab, ...(filter === 'available' ? styles.activeTab : {}) }}
                        onClick={() => setFilter('available')}
                    >
                        Có thể đăng ký ({learningPaths.filter(p => !p.isEnrolled).length})
                    </button>
                </div>

                {/* Learning Paths Grid */}
                <div style={styles.pathsGrid}>
                    {filteredPaths.map(path => (
                        <div key={path.id} style={styles.pathCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.cardTitle}>{path.title}</div>
                                <div
                                    style={{
                                        ...styles.difficultyBadge,
                                        backgroundColor: getDifficultyColor(path.difficulty)
                                    }}
                                >
                                    {path.difficulty}
                                </div>
                            </div>

                            <div style={styles.cardContent}>
                                <p style={styles.cardDescription}>{path.description}</p>

                                <div style={styles.instructorInfo}>
                                    👨‍🏫 Instructor: {path.instructor}
                                </div>

                                <div style={styles.cardMeta}>
                                    <div style={styles.metaItem}>📚 {path.coursesCount} courses</div>
                                    <div style={styles.metaItem}>👥 {path.enrolledCount} enrolled</div>
                                    <div style={styles.metaItem}>⏱️ {path.estimatedHours}h</div>
                                    <div style={styles.metaItem}>🏷️ {path.category}</div>
                                </div>

                                {path.isEnrolled && (
                                    <div style={styles.progressSection}>
                                        <div style={styles.progressLabel}>
                                            Tiến độ: {path.progress}%
                                        </div>
                                        <div style={styles.progressBar}>
                                            <div
                                                style={{
                                                    ...styles.progressFill,
                                                    width: `${path.progress}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={styles.cardActions}>
                                <button
                                    style={styles.detailButton}
                                    onClick={() => navigate(`/learning-paths/${path.id}`)}
                                >
                                    Xem chi tiết
                                </button>

                                {!path.isEnrolled ? (
                                    <button
                                        style={styles.enrollButton}
                                        onClick={() => handleEnroll(path.id)}
                                    >
                                        Đăng ký học
                                    </button>
                                ) : (
                                    <button
                                        style={styles.continueButton}
                                        onClick={() => navigate(`/learning-paths/${path.id}/continue`)}
                                    >
                                        Tiếp tục học
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

// ... styles giữ nguyên như trước
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    header: {
        marginBottom: '32px'
    },
    pageTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 8px 0'
    },
    pageSubtitle: {
        fontSize: '16px',
        color: '#64748b',
        margin: 0,
        lineHeight: '1.5'
    },
    filterTabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '16px'
    },
    tab: {
        background: 'none',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        color: '#64748b',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    },
    activeTab: {
        background: '#667eea',
        color: 'white'
    },
    pathsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '24px'
    },
    pathCard: {
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    cardHeader: {
        padding: '20px 24px 16px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b',
        lineHeight: '1.4',
        flex: 1
    },
    difficultyBadge: {
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    cardContent: {
        padding: '0 24px 20px'
    },
    cardDescription: {
        color: '#64748b',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '12px'
    },
    instructorInfo: {
        fontSize: '13px',
        color: '#667eea',
        fontWeight: '500',
        marginBottom: '16px'
    },
    cardMeta: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '16px'
    },
    metaItem: {
        fontSize: '13px',
        color: '#64748b'
    },
    progressSection: {
        marginTop: '16px'
    },
    progressLabel: {
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '500',
        marginBottom: '6px'
    },
    progressBar: {
        height: '6px',
        background: '#f1f5f9',
        borderRadius: '3px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #10b981, #059669)',
        borderRadius: '3px',
        transition: 'width 0.3s ease'
    },
    cardActions: {
        padding: '16px 24px',
        background: '#f8fafc',
        display: 'flex',
        gap: '12px'
    },
    detailButton: {
        background: 'none',
        border: '2px solid #e2e8f0',
        color: '#64748b',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        flex: 1
    },
    enrollButton: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        flex: 1
    },
    continueButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        flex: 1
    }
};

export default LearningPath;
