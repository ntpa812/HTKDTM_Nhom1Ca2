import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'courses', label: 'Khóa học', icon: '📚', path: '/courses' },
        { id: 'learning', label: 'Học tập', icon: '📖', path: '/learning' },
        { id: 'analytics', label: 'Thống kê', icon: '📈', path: '/analytics' },
        { id: 'richtext', label: 'Rich Text Editor', icon: '📄', path: '/rich-text-editor' }, // Mục mới
        { id: 'ai', label: 'AI Assistant', icon: '🤖', path: '/ai-assistant' },
        { id: 'settings', label: 'Cài đặt', icon: '⚙️', path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
                <h1
                    style={styles.logo}
                    onClick={() => navigate('/dashboard')}
                >
                    Smart LMS
                </h1>
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
                    >
                        <span style={styles.menuIcon}>{item.icon}</span>
                        <span style={styles.menuLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div style={styles.sidebarFooter}>
                <div style={styles.userProfile}>
                    <div style={styles.userAvatar}>
                        {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div style={styles.userInfo}>
                        <p style={styles.userName}>{user?.full_name || user?.username}</p>
                        <p style={styles.userRole}>
                            {user?.role === 'student' ? 'Học viên' : 'Quản trị'}
                        </p>
                    </div>
                </div>
                <button onClick={onLogout} style={styles.logoutBtn}>
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
        padding: '32px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logo: {
        color: 'white',
        fontSize: '24px',
        fontWeight: '700',
        margin: 0,
        cursor: 'pointer',
        transition: 'opacity 0.3s ease'
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
        textAlign: 'left'
    },
    menuItemActive: {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    menuIcon: {
        fontSize: '20px',
        minWidth: '20px'
    },
    menuLabel: {
        flex: 1
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
        padding: '8px',
        borderRadius: '12px',
        transition: 'background 0.3s ease'
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
        flexShrink: 0
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
