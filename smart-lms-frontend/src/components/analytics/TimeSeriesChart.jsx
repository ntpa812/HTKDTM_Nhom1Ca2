import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

function TimeSeriesChart({ data }) {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="new_enrollments" name="Đăng ký mới" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="new_completions" name="Hoàn thành" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TimeSeriesChart;
