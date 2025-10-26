import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
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
        <div style={{ padding: '40px' }}>
            <h1>Dashboard - Smart LMS</h1>
            {user && (
                <div>
                    <p>Welcome, {user.full_name}!</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px' }}>
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
