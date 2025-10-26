import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

function DashboardRouter() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.role) {
            navigate('/login');
        }
    }, [user, navigate]);

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
