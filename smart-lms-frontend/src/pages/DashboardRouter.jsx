import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

function DashboardRouter() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Kiểm tra authentication
        if (!token || !user.role) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [user, navigate, token]);

    // Hiển thị loading nếu chưa có user data
    if (!user.role) {
        return <div>Loading...</div>;
    }

    // Route based on role
    switch (user.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'instructor':
            return <InstructorDashboard />;
        case 'student':
        default:
            return <Dashboard />;
    }
}

export default DashboardRouter;
