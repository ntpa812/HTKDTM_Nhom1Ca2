// smart-lms-frontend/src/components/modals/CreateLearningPathModal.jsx
import React, { useState, useEffect } from 'react';

function CreateLearningPathModal({ isOpen, onClose, onSuccess }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        estimated_hours: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setFormData({
                title: '',
                description: '',
                category: '',
                difficulty: 'Beginner',
                estimated_hours: 0
            });
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!formData.title || !formData.category) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        try {
            // Mock API call
            console.log('Creating learning path:', formData);

            // Simulate API delay
            setTimeout(() => {
                setLoading(false);
                onSuccess && onSuccess();
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>Tạo Learning Path mới</h2>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div style={styles.modalBody}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tên Learning Path *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="VD: Full-Stack Web Development"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={styles.select}
                            >
                                <option value="">Chọn category</option>
                                <option value="Programming">Programming</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="DevOps">DevOps</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                style={styles.select}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Estimated Hours</label>
                        <input
                            type="number"
                            value={formData.estimated_hours}
                            onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            style={styles.input}
                            min="0"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả về learning path này..."
                            style={styles.textarea}
                            rows="4"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.modalFooter}>
                    <button style={styles.btnSecondary} onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        style={styles.btnPrimary}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo Learning Path'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
    },
    modal: {
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
    },
    modalTitle: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '600'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'all 0.2s'
    },
    modalBody: {
        flex: 1,
        overflow: 'auto',
        padding: '32px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    label: {
        display: 'block',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px',
        fontSize: '0.9rem'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '10px 12px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '10px 12px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '20px 32px',
        borderTop: '1px solid #e5e7eb',
        background: '#f8fafc'
    },
    btnSecondary: {
        background: 'none',
        border: '1px solid #d1d5db',
        color: '#6b7280',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }
};

export default CreateLearningPathModal;
