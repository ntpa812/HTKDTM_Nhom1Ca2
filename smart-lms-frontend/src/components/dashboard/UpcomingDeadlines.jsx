import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingDeadlines = () => {
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeadlines = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/dashboard/deadlines', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDeadlines(response.data.data || []);
            } catch (error) {
                console.error('Error fetching deadlines:', error);
                setDeadlines(getMockDeadlines());
            } finally {
                setLoading(false);
            }
        };

        fetchDeadlines();
    }, []);

    const getMockDeadlines = () => [
        {
            id: 1,
            title: 'Quiz: React Fundamentals',
            type: 'quiz',
            course: 'Web Development',
            dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
            isCompleted: false
        },
        {
            id: 2,
            title: 'Assignment: Build REST API',
            type: 'assignment',
            course: 'Backend Development',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
            isCompleted: false
        },
        {
            id: 3,
            title: 'Final Exam: Database Design',
            type: 'exam',
            course: 'Database Systems',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            isCompleted: false
        },
        {
            id: 4,
            title: 'Project: E-commerce App',
            type: 'project',
            course: 'Full Stack Development',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isCompleted: false
        }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'quiz': return '📝';
            case 'assignment': return '📋';
            case 'exam': return '🎓';
            case 'project': return '💼';
            default: return '📌';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'quiz': return '#3B82F6';
            case 'assignment': return '#10B981';
            case 'exam': return '#EF4444';
            case 'project': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const isUrgent = (dueDate) => {
        const hoursUntilDue = (new Date(dueDate) - new Date()) / (1000 * 60 * 60);
        return hoursUntilDue <= 24;
    };

    const getTimeRemaining = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff < 0) return { text: 'Quá hạn', color: '#EF4444' };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return { text: `${minutes} phút`, color: '#EF4444' };
        }
        if (hours < 24) {
            return { text: `${hours} giờ`, color: '#F59E0B' };
        }
        if (days === 1) {
            return { text: '1 ngày', color: '#F59E0B' };
        }
        if (days <= 3) {
            return { text: `${days} ngày`, color: '#10B981' };
        }
        return { text: `${days} ngày`, color: '#6B7280' };
    };

    const formatDueDate = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleMarkComplete = async (id) => {
        try {
            // API call to mark as complete
            setDeadlines(deadlines.map(d =>
                d.id === id ? { ...d, isCompleted: !d.isCompleted } : d
            ));
        } catch (error) {
            console.error('Error marking complete:', error);
        }
    };

    const handleItemClick = (deadline) => {
        // Navigate to quiz/assignment page
        console.log('Navigate to:', deadline);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSkeleton}>
                    <div style={styles.skeletonHeader}></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={styles.skeletonItem}>
                            <div style={styles.skeletonIcon}></div>
                            <div style={styles.skeletonContent}>
                                <div style={styles.skeletonTitle}></div>
                                <div style={styles.skeletonSubtitle}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>📅 Deadline sắp tới</h2>
                <span style={styles.count}>{deadlines.filter(d => !d.isCompleted).length}</span>
            </div>

            <div style={styles.list}>
                {deadlines.length === 0 ? (
                    <p style={styles.emptyState}>🎉 Không có deadline nào!</p>
                ) : (
                    deadlines
                        .filter(d => !d.isCompleted)
                        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                        .map((deadline) => {
                            const timeRemaining = getTimeRemaining(deadline.dueDate);
                            const urgent = isUrgent(deadline.dueDate);

                            return (
                                <div
                                    key={deadline.id}
                                    style={{
                                        ...styles.deadlineItem,
                                        ...(urgent ? styles.urgentItem : {})
                                    }}
                                    onClick={() => handleItemClick(deadline)}
                                >
                                    {/* Left: Icon & Type */}
                                    <div style={styles.leftSection}>
                                        <div
                                            style={{
                                                ...styles.typeIcon,
                                                backgroundColor: `${getTypeColor(deadline.type)}20`,
                                                color: getTypeColor(deadline.type)
                                            }}
                                        >
                                            {getTypeIcon(deadline.type)}
                                        </div>
                                        <div style={styles.mainInfo}>
                                            <h3 style={styles.deadlineTitle}>{deadline.title}</h3>
                                            <p style={styles.courseName}>{deadline.course}</p>
                                            <p style={styles.dueDate}>
                                                ⏰ {formatDueDate(deadline.dueDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Countdown & Action */}
                                    <div style={styles.rightSection}>
                                        <div style={styles.countdownBadge}>
                                            <span style={{ ...styles.countdownText, color: timeRemaining.color }}>
                                                {timeRemaining.text}
                                            </span>
                                            <span style={styles.remainingLabel}>còn lại</span>
                                        </div>
                                        <button
                                            style={styles.checkButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkComplete(deadline.id);
                                            }}
                                        >
                                            ✓
                                        </button>
                                    </div>

                                    {urgent && (
                                        <div style={styles.urgentBadge}>
                                            🔥 Gấp!
                                        </div>
                                    )}
                                </div>
                            );
                        })
                )}
            </div>

            <button style={styles.viewAllButton}>
                Xem tất cả deadline
            </button>
        </div>
    );
};

// Styles
const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '2px solid #e8eaff',
        height: '100%'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
    },
    title: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '20px',
        fontWeight: '700',
        margin: 0
    },
    count: {
        backgroundColor: '#EF4444',
        color: 'white',
        fontSize: '14px',
        fontWeight: '700',
        padding: '4px 12px',
        borderRadius: '20px'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '16px',
        maxHeight: '500px',
        overflowY: 'auto'
    },
    deadlineItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        border: '2px solid #e8eaff',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
    },
    urgentItem: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2'
    },
    leftSection: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        flex: 1
    },
    typeIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0
    },
    mainInfo: {
        flex: 1,
        minWidth: 0
    },
    deadlineTitle: {
        color: '#2d3748',
        fontSize: '15px',
        fontWeight: '600',
        margin: '0 0 4px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    courseName: {
        color: '#667eea',
        fontSize: '13px',
        fontWeight: '500',
        margin: '0 0 4px 0'
    },
    dueDate: {
        color: '#6B7280',
        fontSize: '12px',
        margin: 0
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    countdownBadge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    countdownText: {
        fontSize: '18px',
        fontWeight: '700'
    },
    remainingLabel: {
        fontSize: '11px',
        color: '#6B7280'
    },
    checkButton: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid #10B981',
        backgroundColor: 'white',
        color: '#10B981',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    urgentBadge: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: '#FEE2E2',
        color: '#EF4444',
        fontSize: '11px',
        fontWeight: '700',
        padding: '4px 8px',
        borderRadius: '6px'
    },
    viewAllButton: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    emptyState: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: '14px',
        padding: '40px 20px'
    },
    // Loading skeleton styles
    loadingSkeleton: {
        animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonHeader: {
        height: '24px',
        width: '60%',
        backgroundColor: '#e8eaff',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    skeletonItem: {
        display: 'flex',
        gap: '12px',
        padding: '16px',
        marginBottom: '12px',
        border: '2px solid #e8eaff',
        borderRadius: '12px'
    },
    skeletonIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#e8eaff',
        borderRadius: '10px'
    },
    skeletonContent: {
        flex: 1
    },
    skeletonTitle: {
        height: '16px',
        width: '80%',
        backgroundColor: '#e8eaff',
        borderRadius: '4px',
        marginBottom: '8px'
    },
    skeletonSubtitle: {
        height: '12px',
        width: '60%',
        backgroundColor: '#e8eaff',
        borderRadius: '4px'
    }
};

export default UpcomingDeadlines;
