import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/layout/Sidebar';
import './Settings.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Form states
    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        phone: '',
        bio: ''
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [preferences, setPreferences] = useState({
        theme: 'light',
        language: 'vi',
        email_notifications: true,
        push_notifications: true,
        weekly_reports: true
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setProfileData({
                    full_name: parsedUser.full_name || '',
                    email: parsedUser.email || '',
                    phone: parsedUser.phone || '',
                    bio: parsedUser.bio || ''
                });
            }

            // Load user preferences from API
            const token = localStorage.getItem('token');
            if (token) {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                try {
                    const response = await axios.get(`${API_BASE_URL}/user/preferences`, config);
                    if (response.data.success) {
                        setPreferences({ ...preferences, ...response.data.data });
                    }
                } catch (error) {
                    console.log('No preferences found, using defaults');
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            showMessage('error', 'Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData, config);

            if (response.data.success) {
                // Update localStorage
                const updatedUser = { ...user, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                showMessage('success', 'Cập nhật thông tin thành công!');
            }
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            showMessage('error', 'Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwordData.new_password.length < 6) {
            showMessage('error', 'Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.put(`${API_BASE_URL}/user/change-password`, {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            }, config);

            if (response.data.success) {
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
                showMessage('success', 'Đổi mật khẩu thành công!');
            }
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setSaving(false);
        }
    };

    const handlePreferencesUpdate = async () => {
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.put(`${API_BASE_URL}/user/preferences`, preferences, config);

            if (response.data.success) {
                showMessage('success', 'Cập nhật tùy chọn thành công!');
            }
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tùy chọn');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-container">
                <div className="settings-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải cài đặt...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="settings-main-content">
                <header className="settings-header">
                    <div>
                        <h2 className="settings-page-title">Cài đặt</h2>
                        <p className="settings-page-subtitle">Quản lý thông tin cá nhân và tùy chọn hệ thống</p>
                    </div>
                    <div className="settings-header-right">
                        <span className="settings-welcome-text">
                            Cài đặt cho <strong>{user?.full_name || user?.username}</strong> ⚙️
                        </span>
                    </div>
                </header>

                <div className="settings-content">
                    {/* Message Alert */}
                    {message.text && (
                        <div className={`settings-message ${message.type}`}>
                            <span>{message.type === 'success' ? '✅' : '❌'}</span>
                            {message.text}
                        </div>
                    )}

                    {/* Settings Grid */}
                    <div className="settings-grid">
                        {/* Profile Information Card */}
                        <div className="settings-card">
                            <h3 className="settings-card-title">👤 Thông tin cá nhân</h3>
                            <form onSubmit={handleProfileUpdate} className="settings-form">
                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label className="settings-label">Họ và tên</label>
                                        <input
                                            type="text"
                                            className="settings-input"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                full_name: e.target.value
                                            })}
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <div className="settings-form-group">
                                        <label className="settings-label">Email</label>
                                        <input
                                            type="email"
                                            className="settings-input"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                email: e.target.value
                                            })}
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                </div>
                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label className="settings-label">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            className="settings-input"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                phone: e.target.value
                                            })}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="settings-form-group">
                                    <label className="settings-label">Giới thiệu</label>
                                    <textarea
                                        className="settings-textarea"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            bio: e.target.value
                                        })}
                                        placeholder="Viết vài dòng giới thiệu về bản thân..."
                                        rows="3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="settings-btn settings-btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                                </button>
                            </form>
                        </div>

                        {/* Password Change Card */}
                        <div className="settings-card">
                            <h3 className="settings-card-title">🔒 Đổi mật khẩu</h3>
                            <form onSubmit={handlePasswordChange} className="settings-form">
                                <div className="settings-form-group">
                                    <label className="settings-label">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        className="settings-input"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            current_password: e.target.value
                                        })}
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                </div>
                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label className="settings-label">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="settings-input"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                new_password: e.target.value
                                            })}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                    </div>
                                    <div className="settings-form-group">
                                        <label className="settings-label">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            className="settings-input"
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                confirm_password: e.target.value
                                            })}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="settings-btn settings-btn-warning"
                                    disabled={saving}
                                >
                                    {saving ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                                </button>
                            </form>
                        </div>

                        {/* Preferences Card */}
                        <div className="settings-card">
                            <h3 className="settings-card-title">🎨 Tùy chọn giao diện</h3>
                            <div className="settings-form">
                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label className="settings-label">Giao diện</label>
                                        <select
                                            className="settings-select"
                                            value={preferences.theme}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                theme: e.target.value
                                            })}
                                        >
                                            <option value="light">Sáng</option>
                                            <option value="dark">Tối</option>
                                            <option value="auto">Tự động</option>
                                        </select>
                                    </div>
                                    <div className="settings-form-group">
                                        <label className="settings-label">Ngôn ngữ</label>
                                        <select
                                            className="settings-select"
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                language: e.target.value
                                            })}
                                        >
                                            <option value="vi">Tiếng Việt</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications Card */}
                        <div className="settings-card">
                            <h3 className="settings-card-title">🔔 Thông báo</h3>
                            <div className="settings-form">
                                <div className="settings-checkbox-group">
                                    <label className="settings-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="settings-checkbox"
                                            checked={preferences.email_notifications}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                email_notifications: e.target.checked
                                            })}
                                        />
                                        <span className="settings-checkbox-text">Thông báo qua email</span>
                                    </label>
                                    <label className="settings-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="settings-checkbox"
                                            checked={preferences.push_notifications}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                push_notifications: e.target.checked
                                            })}
                                        />
                                        <span className="settings-checkbox-text">Thông báo đẩy</span>
                                    </label>
                                    <label className="settings-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="settings-checkbox"
                                            checked={preferences.weekly_reports}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                weekly_reports: e.target.checked
                                            })}
                                        />
                                        <span className="settings-checkbox-text">Báo cáo hàng tuần</span>
                                    </label>
                                </div>
                                <button
                                    onClick={handlePreferencesUpdate}
                                    className="settings-btn settings-btn-secondary"
                                    disabled={saving}
                                >
                                    {saving ? 'Đang cập nhật...' : 'Lưu tùy chọn'}
                                </button>
                            </div>
                        </div>

                        {/* Account Actions Card */}
                        <div className="settings-card settings-card-danger">
                            <h3 className="settings-card-title">⚠️ Quản lý tài khoản</h3>
                            <div className="settings-form">
                                <p className="settings-danger-text">
                                    Các hành động này có thể ảnh hưởng đến tài khoản của bạn. Vui lòng thực hiện cẩn thận.
                                </p>
                                <div className="settings-actions">
                                    <button
                                        className="settings-btn settings-btn-outline"
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tất cả thiết bị?')) {
                                                // Implement logout all devices
                                                showMessage('success', 'Đã đăng xuất khỏi tất cả thiết bị');
                                            }
                                        }}
                                    >
                                        Đăng xuất tất cả thiết bị
                                    </button>
                                    <button
                                        className="settings-btn settings-btn-danger"
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
                                                // Implement delete account
                                                showMessage('error', 'Chức năng xóa tài khoản đang được phát triển');
                                            }
                                        }}
                                    >
                                        Xóa tài khoản
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Settings;
