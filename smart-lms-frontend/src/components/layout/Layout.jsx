import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children, title, subtitle }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <Sidebar user={user} onLogout={handleLogout} />
            <main style={styles.mainContent}>
                <Header title={title} subtitle={subtitle} />
                <div style={styles.content}>
                    {children}
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
    mainContent: {
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
    },
    content: {
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto'
    }
};

export default Layout;
