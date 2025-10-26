import React from 'react';

function Header({ title, subtitle }) {
    return (
        <header style={styles.header}>
            <div>
                <h2 style={styles.title}>{title}</h2>
                {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
            </div>
        </header>
    );
}

const styles = {
    header: {
        background: 'white',
        padding: '32px 40px',
        borderBottom: '2px solid #e8eaff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    subtitle: {
        color: '#6c757d',
        fontSize: '14px',
        margin: 0
    }
};

export default Header;
