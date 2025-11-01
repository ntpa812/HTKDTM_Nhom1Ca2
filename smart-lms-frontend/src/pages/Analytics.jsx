import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import './Analytics.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Component con để tùy chỉnh Tooltip cho đẹp hơn
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Ngày: ${label}`}</p>
                <p className="intro" style={{ color: payload[0].color }}>
                    {`${payload[0].name}: ${payload[0].value}`}
                </p>
                <p className="intro" style={{ color: payload[1].color }}>
                    {`${payload[1].name}: ${payload[1].value}`}
                </p>
            </div>
        );
    }
    return null;
};


function Analytics() {
    // State cho bảng tổng quan
    const [overviewData, setOverviewData] = useState([]);
    // State cho biểu đồ chuỗi thời gian
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    // State cho việc chọn mốc thời gian
    const [timePeriod, setTimePeriod] = useState(30);
    // State chung cho loading và error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm lấy dữ liệu cho bảng tổng quan
    const fetchOverviewData = useCallback(async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/analytics/paths-overview`, config);
            if (response.data.success) {
                setOverviewData(response.data.data);
            } else {
                throw new Error(response.data.message || 'Không thể tải dữ liệu tổng quan.');
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu tổng quan:", err);
            // Ném lỗi ra ngoài để Promise.all bắt được
            throw err;
        }
    }, []);

    // Hàm lấy dữ liệu cho biểu đồ chuỗi thời gian
    const fetchTimeSeriesData = useCallback(async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/analytics/timeseries?period=${timePeriod}`, config);
            if (response.data.success) {
                setTimeSeriesData(response.data.data);
            } else {
                throw new Error(response.data.message || 'Không thể tải dữ liệu chuỗi thời gian.');
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu chuỗi thời gian:", err);
            throw err;
        }
    }, [timePeriod]); // Phụ thuộc vào timePeriod, sẽ được gọi lại khi timePeriod thay đổi

    // useEffect chính để điều phối việc gọi API
    useEffect(() => {
        const loadAllAnalyticsData = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem phân tích.');
                setLoading(false);
                return;
            }

            try {
                // Gọi cả hai API song song để tăng tốc độ tải
                await Promise.all([
                    fetchOverviewData(token),
                    fetchTimeSeriesData(token)
                ]);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi không xác định.');
            } finally {
                setLoading(false);
            }
        };

        loadAllAnalyticsData();
    }, [fetchOverviewData, fetchTimeSeriesData]); // Chạy lại khi một trong hai hàm fetch thay đổi (tức là khi timePeriod thay đổi)

    // Hàm helper để render màu cho tỷ lệ
    const getRateColor = (rate) => {
        if (rate >= 75) return 'rate-high';
        if (rate >= 40) return 'rate-medium';
        return 'rate-low';
    };

    if (loading) {
        return (
            <Layout title="Learning Path Analytics" subtitle="Đang tổng hợp và phân tích dữ liệu...">
                <div className="loadingContainer">
                    <div className="loadingSpinner">🔄</div>
                    <p>Vui lòng chờ trong giây lát...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title="Lỗi" subtitle="Không thể tải dữ liệu">
                <div className="error-container">
                    <p>Đã xảy ra lỗi: {error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Learning Path Analytics" subtitle="So sánh hiệu suất và đánh giá các lộ trình học tập">
            <div className="analytics-container">
                {/* --- KHU VỰC BIỂU ĐỒ --- */}
                <div className="chart-section-wrapper">
                    <div className="time-period-selector">
                        <h3>Hoạt động theo thời gian</h3>
                        <div>
                            {[7, 30, 90].map(period => (
                                <button
                                    key={period}
                                    className={`time-btn ${timePeriod === period ? 'active' : ''}`}
                                    onClick={() => setTimePeriod(period)}
                                >
                                    {period} ngày qua
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <TimeSeriesChart data={timeSeriesData} />
                    </div>
                </div>

                {/* --- KHU VỰC BẢNG TỔNG QUAN --- */}
                <div className="table-wrapper">
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>Tên Lộ Trình</th>
                                <th>Giảng viên</th>
                                <th>Số Học viên</th>
                                <th>Tỷ lệ Hoàn thành</th>
                                <th>TGian HT (ngày)</th>
                                <th>Điểm Drop-out chính</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overviewData.map((path) => (
                                <tr key={path.id}>
                                    {/* Cột 1: Tên lộ trình (không đổi) */}
                                    <td>
                                        <div className="path-title">{path.title}</div>
                                        <div className={`path-difficulty ${path.difficulty}`}>{path.difficulty}</div>
                                    </td>

                                    {/* Cột 2: Giảng viên (không đổi) */}
                                    <td>{path.instructor_name || 'N/A'}</td>

                                    {/* === THÊM CLASSNAME VÀO CÁC CỘT SỐ LIỆU === */}
                                    <td className="text-right">{path.total_enrollments}</td>
                                    <td className="text-right">
                                        <span className={`rate-badge ${getRateColor(path.completion_rate)}`}>
                                            {path.completion_rate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="text-right">{path.avg_completion_days.toFixed(1)}</td>

                                    {/* Cột 6: Điểm drop-out (không đổi) */}
                                    <td>{path.top_dropout_course || 'Chưa có dữ liệu'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

// Component biểu đồ nên được tách ra, nhưng để đây cho tiện copy
const TimeSeriesChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="new_enrollments" name="Đăng ký mới" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="new_completions" name="Hoàn thành" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Analytics;
