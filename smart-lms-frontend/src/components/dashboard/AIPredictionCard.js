import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AIPredictionCard.css'; // Sẽ tạo file CSS sau

const COLORS = {
    'Giỏi': '#10B981',
    'Khá': '#3B82F6',
    'Trung bình': '#F59E0B',
    'Yếu': '#EF4444',
};

const getStudentClusterInfo = (clusterId) => {
    const clusters = [
        { name: 'Nhóm Tự giác', description: 'Bạn có khả năng tự học tốt và tiến độ ổn định.' },
        { name: 'Nhóm Tiềm năng', description: 'Bạn có tiềm năng lớn, cần tăng thêm thời gian học để bứt phá.' },
        { name: 'Nhóm Cần Nỗ lực', description: 'Kết quả của bạn chưa như ý, hãy tập trung vào các môn học yếu.' },
        { name: 'Nhóm Cần Hỗ trợ', description: 'Hệ thống nhận thấy bạn cần sự hỗ trợ. Đừng ngần ngại liên hệ giảng viên.' },
    ];
    return clusters[clusterId] || clusters[2];
}

const AIPredictionCard = ({ prediction }) => {
    if (!prediction) {
        return (
            <div className="ai-card">
                <h3 className="ai-card-title">🔮 Phân tích từ AI</h3>
                <div className="ai-card-loading">
                    <p>Không đủ dữ liệu để phân tích. Hãy bắt đầu học để nhận được dự đoán từ AI!</p>
                </div>
            </div>
        );
    }

    const { cluster, predicted_grade, probabilities } = prediction;
    const clusterInfo = getStudentClusterInfo(cluster);

    const chartData = Object.entries(probabilities).map(([name, value]) => ({
        name,
        value: Math.round(value * 100),
    }));

    return (
        <div className="ai-card">
            <h3 className="ai-card-title">🔮 Phân tích & Dự đoán từ AI</h3>
            <div className="ai-card-content">
                <div className="ai-prediction-chart">
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {chartData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="ai-prediction-summary">
                    <p className="ai-summary-label">Kết quả dự đoán:</p>
                    <p className="ai-summary-grade" style={{ color: COLORS[predicted_grade] }}>
                        {predicted_grade}
                    </p>
                    <p className="ai-summary-label">Bạn thuộc:</p>
                    <p className="ai-summary-cluster">{clusterInfo.name}</p>
                    <p className="ai-summary-advice">{clusterInfo.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AIPredictionCard;
