import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                // Save token to localStorage
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                // Redirect to dashboard
                navigate('/dashboard');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.message ||
                'Lỗi đăng nhập. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Đăng nhập Smart LMS</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="student1@test.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="••••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* <div className="login-footer">
                    <p>Test accounts:</p>
                    <ul>
                        <li>Email: student01@test.com | Password: password123</li>
                        <li>Email: admin@smartlms.com | Password: admin123</li>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}

export default Login;
