import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, BookOpen, Award, MessageSquare, CheckCircle } from 'lucide-react';

const RecentActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/dashboard/activities', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setActivities(response.data.data || []);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setActivities(getMockActivities());
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []); // ✅ Empty dependency array


    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/dashboard/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(response.data.data || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
            // Use mock data nếu API chưa ready
            setActivities(getMockActivities());
        } finally {
            setLoading(false);
        }
    };

    const getMockActivities = () => [
        {
            id: 1,
            type: 'enrollment',
            message: 'Đã đăng ký khóa học "Advanced JavaScript"',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            icon: 'book'
        },
        {
            id: 2,
            type: 'quiz',
            message: 'Hoàn thành Quiz: React Fundamentals - Điểm 85/100',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            icon: 'check'
        },
        {
            id: 3,
            type: 'achievement',
            message: 'Đạt được huy hiệu "Quick Learner"',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            icon: 'award'
        },
        {
            id: 4,
            type: 'comment',
            message: 'Đã bình luận trong khóa học "Web Development"',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            icon: 'message'
        },
        {
            id: 5,
            type: 'complete',
            message: 'Hoàn thành bài học "ES6 Features"',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            icon: 'check'
        }
    ];

    const getIcon = (iconType) => {
        const iconProps = { size: 20, className: 'text-white' };
        switch (iconType) {
            case 'book': return <BookOpen {...iconProps} />;
            case 'check': return <CheckCircle {...iconProps} />;
            case 'award': return <Award {...iconProps} />;
            case 'message': return <MessageSquare {...iconProps} />;
            default: return <Clock {...iconProps} />;
        }
    };

    const getIconBgColor = (type) => {
        switch (type) {
            case 'enrollment': return 'bg-gradient-to-br from-blue-500 to-blue-600';
            case 'quiz': return 'bg-gradient-to-br from-green-500 to-green-600';
            case 'achievement': return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
            case 'comment': return 'bg-gradient-to-br from-purple-500 to-purple-600';
            case 'complete': return 'bg-gradient-to-br from-teal-500 to-teal-600';
            default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days === 1) return 'Hôm qua';
        if (days < 7) return `${days} ngày trước`;
        return new Date(timestamp).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    Hoạt động gần đây
                </h2>
                <button className="text-sm text-[#667eea] hover:text-[#764ba2] font-medium transition-colors">
                    Xem tất cả
                </button>
            </div>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có hoạt động nào</p>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getIconBgColor(activity.type)} flex items-center justify-center shadow-md`}>
                                {getIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {formatTimestamp(activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivities;
