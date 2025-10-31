import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
    const location = useLocation();
    // Kiểm tra xem có 'token' trong localStorage không
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang /login
        // Giữ lại trang hiện tại để có thể quay lại sau khi đăng nhập thành công
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu đã đăng nhập, cho phép truy cập vào trang yêu cầu
    return children;
}

export default PrivateRoute;
