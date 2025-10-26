import React from 'react';
import Layout from '../components/layout/Layout';

function LearningPath() {
    return (
        <Layout title="Học tập" subtitle="Lộ trình học tập cá nhân hóa">
            <div style={styles.placeholder}>
                <h3 style={styles.placeholderTitle}>📖 Trang Học tập</h3>
                <p style={styles.placeholderText}>Đang phát triển...</p>
            </div>
        </Layout>
    );
}

const styles = {
    placeholder: {
        background: 'white',
        padding: '80px 40px',
        borderRadius: '16px',
        textAlign: 'center',
        border: '2px solid #e8eaff'
    },
    placeholderTitle: {
        color: '#667eea',
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 16px 0'
    },
    placeholderText: {
        color: '#6c757d',
        fontSize: '16px',
        margin: 0
    }
};

export default LearningPath;
