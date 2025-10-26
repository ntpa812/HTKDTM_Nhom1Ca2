// smart-lms-frontend/src/pages/InstructorLearningPaths.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

function InstructorLearningPaths() {
    const navigate = useNavigate();
    const [myPaths, setMyPaths] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        // Mock instructor's learning paths
        setMyPaths([
            {
                id: 1,
                title: "Full-Stack Web Development",
                description: "Lộ trình từ Frontend đến Backend với React và Node.js",
                category: "Web Development",
                difficulty: "Intermediate",
                coursesCount: 6,
                enrolledCount: 124,
                estimatedHours: 180,
                isPublished: true,
                createdAt: "2024-10-15",
                lastUpdated: "2024-10-20",
                completionRate: 78
            },
            {
                id: 2,
                title: "Advanced JavaScript Concepts",
                description: "Khám phá các concept nâng cao của JavaScript",
                category: "Programming",
                difficulty: "Advanced",
                coursesCount: 4,
                enrolledCount: 67,
                estimatedHours: 120,
                isPublished: true,
                createdAt: "2024-09-10",
                lastUpdated: "2024-10-18",
                completionRate: 65
            },
            {
                id: 3,
                title: "React Performance Optimization",
                description: "Tối ưu hiệu suất ứng dụng React",
                category: "Web Development",
                difficulty: "Advanced",
                coursesCount: 3,
                enrolledCount: 0,
                estimatedHours: 80,
                isPublished: false,
                createdAt: "2024-10-25",
                lastUpdated: "2024-10-25",
                completionRate: 0
            }
        ]);

        setStats({
            totalPaths: 3,
            publishedPaths: 2,
            totalEnrollments: 191,
            avgCompletionRate: 71
        });
    }, []);

    const handlePublishToggle = (pathId) => {
        setMyPaths(paths =>
            paths.map(path =>
                path.id === pathId
                    ? { ...path, isPublished: !path.isPublished }
                    : path
            )
        );
    };

    const handleDeletePath = (pathId) => {
        if (window.confirm('Bạn có chắc muốn xóa learning path này?')) {
            setMyPaths(paths => paths.filter(path => path.id !== pathId));
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return '#10b981';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <Layout title="Quản lý Learning Paths" subtitle="Tạo và quản lý lộ trình học tập">
            <div style={styles.container}>
                {/* Header with Stats */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.pageTitle}>📚 Learning Paths của tôi</h2>
                        <p style={styles.pageSubtitle}>
                            Quản lý các lộ trình học tập bạn đã tạo
                        </p>
                    </div>

                    <button
                        style={styles.createButton}
                        onClick={() => navigate('/create-path')}
                    >
                        ➕ Tạo Learning Path mới
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{stats.totalPaths}</div>
                        <div style={styles.statLabel}>Tổng Learning Paths</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{stats.publishedPaths}</div>
                        <div style={styles.statLabel}>Đã publish</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{stats.totalEnrollments}</div>
                        <div style={styles.statLabel}>Tổng đăng ký</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{stats.avgCompletionRate}%</div>
                        <div style={styles.statLabel}>Tỷ lệ hoàn thành TB</div>
                    </div>
                </div>

                {/* Learning Paths Table */}
                <div style={styles.tableSection}>
                    <h3 style={styles.sectionTitle}>Danh sách Learning Paths</h3>

                    <div style={styles.pathsList}>
                        {myPaths.map(path => (
                            <div key={path.id} style={styles.pathRow}>
                                <div style={styles.pathMainInfo}>
                                    <div style={styles.pathHeader}>
                                        <h4 style={styles.pathTitle}>{path.title}</h4>
                                        <div style={styles.pathBadges}>
                                            <span
                                                style={{
                                                    ...styles.difficultyBadge,
                                                    backgroundColor: getDifficultyColor(path.difficulty)
                                                }}
                                            >
                                                {path.difficulty}
                                            </span>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: path.isPublished ? '#10b981' : '#f59e0b'
                                            }}>
                                                {path.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={styles.pathDescription}>{path.description}</p>

                                    <div style={styles.pathMetrics}>
                                        <div style={styles.metric}>
                                            📚 {path.coursesCount} courses
                                        </div>
                                        <div style={styles.metric}>
                                            👥 {path.enrolledCount} enrolled
                                        </div>
                                        <div style={styles.metric}>
                                            ⏱️ {path.estimatedHours}h
                                        </div>
                                        <div style={styles.metric}>
                                            ✅ {path.completionRate}% completion
                                        </div>
                                        <div style={styles.metric}>
                                            📅 Updated: {new Date(path.lastUpdated).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.pathActions}>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={() => navigate(`/learning-paths/${path.id}/edit`)}
                                    >
                                        ✏️ Sửa
                                    </button>

                                    <button
                                        style={styles.actionBtn}
                                        onClick={() => navigate(`/learning-paths/${path.id}/analytics`)}
                                    >
                                        📊 Analytics
                                    </button>

                                    <button
                                        style={{
                                            ...styles.actionBtn,
                                            backgroundColor: path.isPublished ? '#f59e0b' : '#10b981'
                                        }}
                                        onClick={() => handlePublishToggle(path.id)}
                                    >
                                        {path.isPublished ? '📤 Unpublish' : '🚀 Publish'}
                                    </button>

                                    <button
                                        style={{ ...styles.actionBtn, backgroundColor: '#ef4444' }}
                                        onClick={() => handleDeletePath(path.id)}
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {myPaths.length === 0 && (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>📖</div>
                            <h3 style={styles.emptyTitle}>Chưa có Learning Path nào</h3>
                            <p style={styles.emptyText}>
                                Bắt đầu tạo Learning Path đầu tiên để chia sẻ kiến thức của bạn!
                            </p>
                            <button
                                style={styles.createButton}
                                onClick={() => navigate('/create-path')}
                            >
                                ➕ Tạo Learning Path đầu tiên
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
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
        margin: 0
    },
    createButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    statCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '8px'
    },
    statLabel: {
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },
    tableSection: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '24px'
    },
    pathsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    pathRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        background: '#f8fafc'
    },
    pathMainInfo: {
        flex: 1,
        marginRight: '20px'
    },
    pathHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
    },
    pathTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e293b',
        margin: 0,
        flex: 1
    },
    pathBadges: {
        display: 'flex',
        gap: '8px'
    },
    difficultyBadge: {
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600'
    },
    statusBadge: {
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600'
    },
    pathDescription: {
        color: '#64748b',
        fontSize: '14px',
        margin: '0 0 12px 0',
        lineHeight: '1.4'
    },
    pathMetrics: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px'
    },
    metric: {
        fontSize: '12px',
        color: '#64748b'
    },
    pathActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '120px'
    },
    actionBtn: {
        background: '#6b7280',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#64748b'
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    emptyTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '8px'
    },
    emptyText: {
        marginBottom: '24px'
    }
};

export default InstructorLearningPaths;
