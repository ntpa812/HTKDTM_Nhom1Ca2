import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

            // Fetch courses from API
            const response = await api.get('/courses');
            console.log('Courses response:', response.data);

            if (response.data.success && Array.isArray(response.data.data)) {
                setCourses(response.data.data);
            } else {
                setCourses([]);
                setError('Không thể tải danh sách khóa học');
            }
        } catch (error) {
            console.error('Error loading courses:', error);
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

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner':
                return '#10B981';
            case 'intermediate':
                return '#F59E0B';
            case 'advanced':
                return '#EF4444';
            default:
                return '#667eea';
        }
    };

    const getDifficultyText = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner':
                return 'Cơ bản';
            case 'intermediate':
                return 'Trung bình';
            case 'advanced':
                return 'Nâng cao';
            default:
                return difficulty || 'N/A';
        }
    };

    // Safe filter with default empty array
    const filteredCourses = Array.isArray(courses)
        ? courses.filter(course => {
            if (filter === 'all') return true;
            return course.difficulty?.toLowerCase() === filter;
        })
        : [];

    // Count courses by difficulty safely
    const getCountByDifficulty = (difficulty) => {
        if (!Array.isArray(courses)) return 0;
        if (difficulty === 'all') return courses.length;
        return courses.filter(c => c.difficulty?.toLowerCase() === difficulty).length;
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Sidebar user={user} onLogout={handleLogout} />
                <main style={styles.mainContent}>
                    <div style={styles.loading}>Đang tải khóa học...</div>
                </main>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Sidebar user={user} onLogout={handleLogout} />

            <main style={styles.mainContent}>
                {/* Header */}
                <header style={styles.header}>
                    <div>
                        <h2 style={styles.pageTitle}>Khóa học</h2>
                        <p style={styles.pageSubtitle}>
                            {error ? error : `Khám phá ${courses.length} khóa học chất lượng cao`}
                        </p>
                    </div>
                </header>

                {/* Content */}
                <div style={styles.content}>
                    {error ? (
                        <div style={styles.errorState}>
                            <p style={styles.errorText}>⚠️ {error}</p>
                            <button onClick={loadData} style={styles.retryBtn}>
                                Thử lại
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Filter Tabs */}
                            <div style={styles.filterContainer}>
                                <button
                                    onClick={() => setFilter('all')}
                                    style={{
                                        ...styles.filterBtn,
                                        ...(filter === 'all' ? styles.filterBtnActive : {})
                                    }}
                                >
                                    Tất cả ({getCountByDifficulty('all')})
                                </button>
                                <button
                                    onClick={() => setFilter('beginner')}
                                    style={{
                                        ...styles.filterBtn,
                                        ...(filter === 'beginner' ? styles.filterBtnActive : {})
                                    }}
                                >
                                    Cơ bản ({getCountByDifficulty('beginner')})
                                </button>
                                <button
                                    onClick={() => setFilter('intermediate')}
                                    style={{
                                        ...styles.filterBtn,
                                        ...(filter === 'intermediate' ? styles.filterBtnActive : {})
                                    }}
                                >
                                    Trung bình ({getCountByDifficulty('intermediate')})
                                </button>
                                <button
                                    onClick={() => setFilter('advanced')}
                                    style={{
                                        ...styles.filterBtn,
                                        ...(filter === 'advanced' ? styles.filterBtnActive : {})
                                    }}
                                >
                                    Nâng cao ({getCountByDifficulty('advanced')})
                                </button>
                            </div>

                            {/* Courses Grid */}
                            {filteredCourses.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p style={styles.emptyText}>
                                        {courses.length === 0
                                            ? '📚 Chưa có khóa học nào'
                                            : '🔍 Không tìm thấy khóa học phù hợp'}
                                    </p>
                                </div>
                            ) : (
                                <div style={styles.coursesGrid}>
                                    {filteredCourses.map((course) => (
                                        <div key={course.id} style={styles.courseCard}>
                                            <div style={styles.courseHeader}>
                                                <span
                                                    style={{
                                                        ...styles.difficultyBadge,
                                                        backgroundColor: getDifficultyColor(course.difficulty) + '20',
                                                        color: getDifficultyColor(course.difficulty)
                                                    }}
                                                >
                                                    {getDifficultyText(course.difficulty)}
                                                </span>
                                                <span style={styles.categoryBadge}>
                                                    {course.category}
                                                </span>
                                            </div>

                                            <h3 style={styles.courseTitle}>{course.title}</h3>

                                            <p style={styles.courseDescription}>
                                                {course.description || 'Không có mô tả'}
                                            </p>

                                            <div style={styles.courseFooter}>
                                                <div style={styles.courseInfo}>
                                                    <span style={styles.infoItem}>
                                                        ⏱️ {course.duration_hours}h
                                                    </span>
                                                    <span style={styles.infoItem}>
                                                        👥 {course.enrolled_count || 0}
                                                    </span>
                                                </div>
                                                <button style={styles.enrollBtn}>
                                                    Đăng ký
                                                </button>
                                            </div>
                                        </div>
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

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f5f7fa'
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#667eea',
        fontSize: '24px',
        fontWeight: '600'
    },
    mainContent: {
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        background: 'white',
        padding: '32px 40px',
        borderBottom: '2px solid #e8eaff'
    },
    pageTitle: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    pageSubtitle: {
        color: '#6c757d',
        fontSize: '14px',
        margin: 0
    },
    content: {
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto'
    },
    errorState: {
        textAlign: 'center',
        padding: '80px 20px',
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #fee',
    },
    errorText: {
        color: '#EF4444',
        fontSize: '16px',
        marginBottom: '20px'
    },
    retryBtn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    filterContainer: {
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap'
    },
    filterBtn: {
        padding: '12px 24px',
        background: 'white',
        border: '2px solid #e8eaff',
        borderRadius: '12px',
        color: '#6c757d',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    filterBtnActive: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderColor: 'transparent'
    },
    coursesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
    },
    courseCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '2px solid #e8eaff',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
    },
    courseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        gap: '8px'
    },
    difficultyBadge: {
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600'
    },
    categoryBadge: {
        color: '#6c757d',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 12px',
        background: '#f0f0f0',
        borderRadius: '8px'
    },
    courseTitle: {
        color: '#2d3748',
        fontSize: '18px',
        fontWeight: '700',
        margin: '0 0 12px 0',
        lineHeight: '1.4'
    },
    courseDescription: {
        color: '#6c757d',
        fontSize: '14px',
        lineHeight: '1.6',
        margin: '0 0 20px 0',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
    },
    courseFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #e8eaff'
    },
    courseInfo: {
        display: 'flex',
        gap: '16px'
    },
    infoItem: {
        color: '#6c757d',
        fontSize: '13px',
        fontWeight: '500'
    },
    enrollBtn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    emptyState: {
        textAlign: 'center',
        padding: '80px 20px',
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #e8eaff'
    },
    emptyText: {
        color: '#6c757d',
        fontSize: '18px'
    }
};

export default Courses;
