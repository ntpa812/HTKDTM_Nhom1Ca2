import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerformanceMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/dashboard/metrics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMetrics(response.data.data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
                setMetrics(getMockMetrics());
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const getMockMetrics = () => ({
        averageScore: 85.5,
        classAverage: 78.2,
        completionRate: 72,
        targetCompletionRate: 80,
        studyTimeToday: 3.5,
        studyTimeGoal: 4,
        engagementScore: 88,
        badges: 12,
        totalBadges: 20,
        streak: 7,
        bestStreak: 14,
        performanceTrend: 'up',
        recentAchievements: [
            { id: 1, name: 'Người học nhanh', icon: '⚡', date: '2 ngày trước' },
            { id: 2, name: 'Bậc thầy Quiz', icon: '🎯', date: '5 ngày trước' },
            { id: 3, name: 'Chuỗi 7 ngày', icon: '🔥', date: '1 ngày trước' }
        ]
    });

    const getProgressColor = (value, target) => {
        const percentage = (value / target) * 100;
        if (percentage >= 90) return '#10B981';
        if (percentage >= 70) return '#F59E0B';
        return '#EF4444';
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            default: return '➡️';
        }
    };

    const getTrendText = (trend) => {
        switch (trend) {
            case 'up': return 'Tăng';
            case 'down': return 'Giảm';
            default: return 'Ổn định';
        }
    };

    if (loading || !metrics) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSkeleton}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={styles.skeletonCard}>
                            <div style={styles.skeletonTitle}></div>
                            <div style={styles.skeletonBar}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>⚡ Chỉ số hiệu suất</h2>
                <span style={styles.trendBadge}>
                    {getTrendIcon(metrics.performanceTrend)} Đang {getTrendText(metrics.performanceTrend)}
                </span>
            </div>

            {/* Main Metrics Grid */}
            <div style={styles.metricsGrid}>
                {/* Average Score */}
                <div style={styles.metricCard}>
                    <div style={styles.metricHeader}>
                        <span style={styles.metricIcon}>📊</span>
                        <h3 style={styles.metricTitle}>Điểm trung bình</h3>
                    </div>
                    <div style={styles.scoreComparison}>
                        <div style={styles.myScore}>
                            <span style={styles.scoreValue}>{metrics.averageScore}%</span>
                            <span style={styles.scoreLabel}>Điểm của bạn</span>
                        </div>
                        <div style={styles.vsText}>vs</div>
                        <div style={styles.classScore}>
                            <span style={styles.scoreValue}>{metrics.classAverage}%</span>
                            <span style={styles.scoreLabel}>TB lớp</span>
                        </div>
                    </div>
                    <div style={styles.difference}>
                        <span style={{
                            ...styles.differenceText,
                            color: metrics.averageScore > metrics.classAverage ? '#10B981' : '#EF4444'
                        }}>
                            {metrics.averageScore > metrics.classAverage ? '+' : ''}
                            {(metrics.averageScore - metrics.classAverage).toFixed(1)}%
                            {metrics.averageScore > metrics.classAverage ? ' cao hơn' : ' thấp hơn'} trung bình
                        </span>
                    </div>
                </div>

                {/* Completion Rate */}
                <div style={styles.metricCard}>
                    <div style={styles.metricHeader}>
                        <span style={styles.metricIcon}>✅</span>
                        <h3 style={styles.metricTitle}>Tỷ lệ hoàn thành</h3>
                    </div>
                    <div style={styles.progressSection}>
                        <div style={styles.progressInfo}>
                            <span style={styles.progressValue}>{metrics.completionRate}%</span>
                            <span style={styles.progressTarget}>Mục tiêu: {metrics.targetCompletionRate}%</span>
                        </div>
                        <div style={styles.progressBarContainer}>
                            <div
                                style={{
                                    ...styles.progressBar,
                                    width: `${metrics.completionRate}%`,
                                    backgroundColor: getProgressColor(metrics.completionRate, metrics.targetCompletionRate)
                                }}
                            ></div>
                        </div>
                        <div style={styles.progressSubtext}>
                            {metrics.targetCompletionRate - metrics.completionRate > 0
                                ? `Còn ${metrics.targetCompletionRate - metrics.completionRate}% nữa đạt mục tiêu`
                                : '🎉 Đã đạt mục tiêu!'}
                        </div>
                    </div>
                </div>

                {/* Study Time */}
                <div style={styles.metricCard}>
                    <div style={styles.metricHeader}>
                        <span style={styles.metricIcon}>⏰</span>
                        <h3 style={styles.metricTitle}>Thời gian học hôm nay</h3>
                    </div>
                    <div style={styles.progressSection}>
                        <div style={styles.progressInfo}>
                            <span style={styles.progressValue}>{metrics.studyTimeToday}h</span>
                            <span style={styles.progressTarget}>Mục tiêu: {metrics.studyTimeGoal}h</span>
                        </div>
                        <div style={styles.progressBarContainer}>
                            <div
                                style={{
                                    ...styles.progressBar,
                                    width: `${(metrics.studyTimeToday / metrics.studyTimeGoal) * 100}%`,
                                    backgroundColor: getProgressColor(metrics.studyTimeToday, metrics.studyTimeGoal)
                                }}
                            ></div>
                        </div>
                        <div style={styles.progressSubtext}>
                            {metrics.studyTimeGoal - metrics.studyTimeToday > 0
                                ? `Còn ${(metrics.studyTimeGoal - metrics.studyTimeToday).toFixed(1)}h trong ngày`
                                : '🎯 Đạt mục tiêu ngày!'}
                        </div>
                    </div>
                </div>

                {/* Engagement Score */}
                <div style={styles.metricCard}>
                    <div style={styles.metricHeader}>
                        <span style={styles.metricIcon}>💪</span>
                        <h3 style={styles.metricTitle}>Điểm tương tác</h3>
                    </div>
                    <div style={styles.circularProgress}>
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#e8eaff"
                                strokeWidth="10"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#667eea"
                                strokeWidth="10"
                                strokeDasharray={`${(metrics.engagementScore / 100) * 314} 314`}
                                strokeLinecap="round"
                                style={{
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: '60px 60px'
                                }}
                            />
                            <text
                                x="60"
                                y="65"
                                textAnchor="middle"
                                fontSize="24"
                                fontWeight="700"
                                fill="#667eea"
                            >
                                {metrics.engagementScore}%
                            </text>
                        </svg>
                        <p style={styles.engagementLabel}>Tương tác tổng thể</p>
                    </div>
                </div>
            </div>

            {/* Achievements & Streaks */}
            <div style={styles.bottomSection}>
                {/* Badges */}
                <div style={styles.achievementCard}>
                    <h3 style={styles.achievementTitle}>🏆 Huy hiệu đạt được</h3>
                    <div style={styles.badgeProgress}>
                        <span style={styles.badgeCount}>{metrics.badges}/{metrics.totalBadges}</span>
                        <div style={styles.badgeBar}>
                            <div
                                style={{
                                    ...styles.badgeFill,
                                    width: `${(metrics.badges / metrics.totalBadges) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Streak */}
                <div style={styles.achievementCard}>
                    <h3 style={styles.achievementTitle}>🔥 Chuỗi học tập</h3>
                    <div style={styles.streakInfo}>
                        <div style={styles.streakCurrent}>
                            <span style={styles.streakNumber}>{metrics.streak}</span>
                            <span style={styles.streakLabel}>ngày</span>
                        </div>
                        <div style={styles.streakBest}>
                            <span style={styles.bestLabel}>Tốt nhất: {metrics.bestStreak} ngày</span>
                        </div>
                    </div>
                </div>

                {/* Recent Achievements */}
                <div style={styles.recentAchievements}>
                    <h3 style={styles.achievementTitle}>✨ Thành tựu gần đây</h3>
                    <div style={styles.achievementsList}>
                        {metrics.recentAchievements.map(achievement => (
                            <div key={achievement.id} style={styles.achievementItem}>
                                <span style={styles.achievementIcon}>{achievement.icon}</span>
                                <div style={styles.achievementInfo}>
                                    <span style={styles.achievementName}>{achievement.name}</span>
                                    <span style={styles.achievementDate}>{achievement.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles remain the same...
const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '2px solid #e8eaff'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
    },
    title: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '20px',
        fontWeight: '700',
        margin: 0
    },
    trendBadge: {
        backgroundColor: '#e8eaff',
        color: '#667eea',
        fontSize: '13px',
        fontWeight: '600',
        padding: '6px 12px',
        borderRadius: '20px'
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    metricCard: {
        padding: '20px',
        border: '2px solid #e8eaff',
        borderRadius: '12px',
        backgroundColor: '#fafbff'
    },
    metricHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
    },
    metricIcon: {
        fontSize: '24px'
    },
    metricTitle: {
        color: '#2d3748',
        fontSize: '14px',
        fontWeight: '600',
        margin: 0
    },
    scoreComparison: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: '12px'
    },
    myScore: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    classScore: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    scoreValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#667eea',
        lineHeight: 1
    },
    scoreLabel: {
        fontSize: '11px',
        color: '#6B7280',
        marginTop: '4px'
    },
    vsText: {
        fontSize: '14px',
        color: '#9CA3AF',
        fontWeight: '600'
    },
    difference: {
        textAlign: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #e8eaff'
    },
    differenceText: {
        fontSize: '13px',
        fontWeight: '600'
    },
    progressSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    progressInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    },
    progressValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#667eea'
    },
    progressTarget: {
        fontSize: '12px',
        color: '#6B7280'
    },
    progressBarContainer: {
        width: '100%',
        height: '8px',
        backgroundColor: '#e8eaff',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressBar: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    progressSubtext: {
        fontSize: '11px',
        color: '#6B7280',
        textAlign: 'center'
    },
    circularProgress: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    engagementLabel: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0
    },
    bottomSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
    },
    achievementCard: {
        padding: '16px',
        border: '2px solid #e8eaff',
        borderRadius: '12px',
        backgroundColor: '#fafbff'
    },
    achievementTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '12px'
    },
    badgeProgress: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    badgeCount: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#F59E0B'
    },
    badgeBar: {
        width: '100%',
        height: '6px',
        backgroundColor: '#e8eaff',
        borderRadius: '3px',
        overflow: 'hidden'
    },
    badgeFill: {
        height: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: '3px'
    },
    streakInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    streakCurrent: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px'
    },
    streakNumber: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#EF4444'
    },
    streakLabel: {
        fontSize: '14px',
        color: '#6B7280'
    },
    streakBest: {
        fontSize: '12px',
        color: '#6B7280'
    },
    bestLabel: {
        fontWeight: '500'
    },
    recentAchievements: {
        padding: '16px',
        border: '2px solid #e8eaff',
        borderRadius: '12px',
        backgroundColor: '#fafbff'
    },
    achievementsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    achievementItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        backgroundColor: 'white',
        borderRadius: '8px'
    },
    achievementIcon: {
        fontSize: '24px'
    },
    achievementInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    achievementName: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2d3748'
    },
    achievementDate: {
        fontSize: '11px',
        color: '#6B7280'
    },
    loadingSkeleton: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
    },
    skeletonCard: {
        padding: '20px',
        border: '2px solid #e8eaff',
        borderRadius: '12px'
    },
    skeletonTitle: {
        height: '20px',
        width: '60%',
        backgroundColor: '#e8eaff',
        borderRadius: '4px',
        marginBottom: '16px'
    },
    skeletonBar: {
        height: '8px',
        width: '100%',
        backgroundColor: '#e8eaff',
        borderRadius: '4px'
    }
};

export default PerformanceMetrics;
