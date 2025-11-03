// smart-lms-frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Menu items theo role
    const getMenuItems = (userRole) => {
        // Tất cả role đều dùng '/dashboard'
        const commonItems = [
            { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' }
        ];

        if (userRole === 'instructor') {
            return [
                ...commonItems,
                { id: 'courses', label: 'Khóa học', icon: '📚', path: '/courses' },
                { id: 'learning', label: 'Learning Paths', icon: '📖', path: '/instructor/learning-paths' },
                { id: 'students', label: 'Học viên', icon: '👥', path: '/instructor/students' },
                { id: 'analytics', label: 'Thống kê', icon: '📈', path: '/analytics' },
                { id: 'ai', label: 'AI Assistant', icon: '🤖', path: '/ai-assistant' },
                { id: 'settings', label: 'Cài đặt', icon: '⚙️', path: '/settings' },
            ];
        }

        if (userRole === 'admin') {
            return [
                ...commonItems,
                { id: 'courses', label: 'Khóa học', icon: '📚', path: '/courses' },
                // { id: 'learning', label: 'Learning Paths', icon: '📖', path: '/admin/learning-paths' },
                { id: 'users', label: 'Người dùng', icon: '👥', path: '/admin/users' },
                // { id: 'analytics', label: 'Thống kê', icon: '📈', path: '/analytics' },
                { id: 'ai', label: 'AI Assistant', icon: '🤖', path: '/ai-assistant' },
                { id: 'settings', label: 'Cài đặt', icon: '⚙️', path: '/settings' },
            ];
        }

        // Student (default)
        return [
            ...commonItems,
            { id: 'learning', label: 'Học tập', icon: '📖', path: '/learning' },
            { id: 'courses', label: 'Khóa học', icon: '📚', path: '/courses' },
            // { id: 'analytics', label: 'Thống kê', icon: '📈', path: '/analytics' },
            // { id: 'ai', label: 'AI Assistant', icon: '🤖', path: '/ai-assistant' },
            { id: 'settings', label: 'Cài đặt', icon: '⚙️', path: '/settings' },
        ];
    };

    const menuItems = getMenuItems(user?.role);

    const isActive = (path) => {
        // Xử lý active cho dashboard paths
        if (path.includes('dashboard')) {
            return location.pathname.includes('dashboard');
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'instructor': return 'Giảng viên';
            case 'admin': return 'Quản trị viên';
            case 'student':
            default: return 'Học viên';
        }
    };

    return (
        <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
                <h1
                    style={styles.logo}
                    onClick={() => navigate('/dashboard')}
                >
                    Smart LMS
                </h1>
                {/* Role badge */}
                <div style={styles.roleBadge}>
                    {getRoleDisplayName(user?.role)}
                </div>
            </div>

            <nav style={styles.nav}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        style={{
                            ...styles.menuItem,
                            ...(isActive(item.path) ? styles.menuItemActive : {})
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive(item.path)) {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive(item.path)) {
                                e.target.style.background = 'transparent';
                            }
                        }}
                    >
                        <span style={styles.menuIcon}>{item.icon}</span>
                        <span style={styles.menuLabel}>{item.label}</span>
                        {isActive(item.path) && (
                            <span style={styles.activeIndicator}>●</span>
                        )}
                    </button>
                ))}
            </nav>

            <div style={styles.sidebarFooter}>
                <div style={styles.userProfile}>
                    <div style={styles.userAvatar}>
                        {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div style={styles.userInfo}>
                        <p style={styles.userName}>
                            {user?.full_name || user?.username}
                        </p>
                        <p style={styles.userRole}>
                            {getRoleDisplayName(user?.role)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    style={styles.logoutBtn}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                >
                    🚪 Đăng xuất
                </button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '280px',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000
    },
    sidebarHeader: {
        padding: '32px 24px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logo: {
        color: 'white',
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 12px 0',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease'
    },
    roleBadge: {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    nav: {
        flex: 1,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        overflowY: 'auto'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'transparent',
        border: 'none',
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'left',
        position: 'relative'
    },
    menuItemActive: {
        background: 'white', // Màu trắng cho item active
        color: '#667eea', // Text màu chính của brand
        fontWeight: '600',
        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
        transform: 'translateX(4px)' // Nhẹ nhàng shift khi active
    },
    menuIcon: {
        fontSize: '20px',
        minWidth: '20px'
    },
    menuLabel: {
        flex: 1
    },
    activeIndicator: {
        color: '#667eea',
        fontSize: '8px',
        animation: 'pulse 2s infinite'
    },
    sidebarFooter: {
        padding: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'white',
        color: '#667eea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    userInfo: {
        flex: 1,
        minWidth: 0
    },
    userName: {
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 0 4px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    userRole: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        margin: 0
    },
    quickActions: {
        marginBottom: '12px'
    },
    quickActionBtn: {
        width: '100%',
        padding: '10px 12px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    logoutBtn: {
        width: '100%',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.15)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }


};

export default Sidebar;
