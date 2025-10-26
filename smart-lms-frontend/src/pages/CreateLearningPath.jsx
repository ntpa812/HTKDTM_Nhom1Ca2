// smart-lms-frontend/src/pages/CreateLearningPath.jsx
import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import './CreateLearningPath.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Sortable Course Item Component
function SortableCourseItem({ course, index, onRemove, onUpdateRequirement }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: course.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`course-item ${isDragging ? 'dragging' : ''}`}
        >
            <div className="course-header">
                <div
                    className="drag-handle"
                    {...attributes}
                    {...listeners}
                    title="Kéo để sắp xếp"
                >
                    ⋮⋮
                </div>
                <div className="course-info">
                    <div className="course-title">#{index + 1}. {course.title}</div>
                    <div className="course-meta">{course.category} • {course.difficulty}</div>
                </div>
                <button
                    onClick={() => onRemove(course.id)}
                    className="remove-btn"
                    title="Xóa khỏi path"
                >
                    ✕
                </button>
            </div>

            <div className="course-requirements">
                <div className="requirement-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={course.require_quiz_complete || false}
                            onChange={(e) => onUpdateRequirement(course.id, 'require_quiz_complete', e.target.checked)}
                        />
                        Yêu cầu hoàn thành quiz
                    </label>
                </div>

                <div className="requirement-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={course.require_assignments_complete || false}
                            onChange={(e) => onUpdateRequirement(course.id, 'require_assignments_complete', e.target.checked)}
                        />
                        Yêu cầu hoàn thành assignments
                    </label>
                </div>

                <div className="requirement-row">
                    <label className="score-label">
                        Điểm tối thiểu để mở khóa:
                        <input
                            type="number"
                            value={course.min_score_required || ''}
                            onChange={(e) => onUpdateRequirement(course.id, 'min_score_required', parseFloat(e.target.value) || null)}
                            placeholder="70"
                            min="0"
                            max="100"
                            className="score-input"
                        />
                        %
                    </label>
                </div>
            </div>
        </div>
    );
}

function CreateLearningPath() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        estimated_hours: 0
    });

    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchAvailableCourses();
    }, []);

    const fetchAvailableCourses = async () => {
        try {
            // Mock data for now (replace with actual API call)
            const mockCourses = [
                { id: 1, title: 'JavaScript Fundamentals', category: 'Programming', difficulty: 'Beginner', duration_hours: 24 },
                { id: 2, title: 'Python for Beginners', category: 'Programming', difficulty: 'Beginner', duration_hours: 20 },
                { id: 3, title: 'React.js Fundamentals', category: 'Web Development', difficulty: 'Intermediate', duration_hours: 32 },
                { id: 4, title: 'Node.js Backend', category: 'Web Development', difficulty: 'Intermediate', duration_hours: 28 },
                { id: 5, title: 'Machine Learning Basics', category: 'AI/ML', difficulty: 'Advanced', duration_hours: 40 },
            ];
            setAvailableCourses(mockCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setSelectedCourses((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addCourse = (course) => {
        setSelectedCourses([...selectedCourses, {
            ...course,
            min_score_required: null,
            require_quiz_complete: false,
            require_assignments_complete: false
        }]);
        setAvailableCourses(availableCourses.filter(c => c.id !== course.id));
    };

    const removeCourse = (courseId) => {
        const course = selectedCourses.find(c => c.id === courseId);
        setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
        setAvailableCourses([...availableCourses, course].sort((a, b) => a.title.localeCompare(b.title)));
    };

    const updateCourseRequirement = (courseId, field, value) => {
        setSelectedCourses(selectedCourses.map(course =>
            course.id === courseId ? { ...course, [field]: value } : course
        ));
    };

    const handleSubmit = async (isDraft = false) => {
        if (!formData.title || !formData.category || selectedCourses.length === 0) {
            alert('Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 course');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                courses: selectedCourses,
                is_published: !isDraft
            };

            console.log('Creating learning path:', payload);

            // Mock success for now
            setTimeout(() => {
                alert(`Learning path đã được ${isDraft ? 'lưu nháp' : 'tạo và publish'} thành công!`);
                setLoading(false);
                // Reset form or redirect
            }, 1000);

        } catch (error) {
            console.error('Error creating path:', error);
            alert('Lỗi khi tạo learning path: ' + error.message);
            setLoading(false);
        }
    };

    const totalEstimatedHours = selectedCourses.reduce((sum, course) => sum + (course.duration_hours || 0), 0);

    return (
        <div className="create-learning-path">
            <div className="container">
                <div className="header">
                    <h1>Tạo Learning Path Mới</h1>
                    <p>Tạo lộ trình học tập có cấu trúc cho sinh viên</p>
                </div>

                {/* Basic Info Form */}
                <div className="form-section">
                    <h2>Thông tin cơ bản</h2>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên Learning Path *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="VD: Full-Stack Web Development Bootcamp"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Chọn category</option>
                                <option value="Programming">Programming</option>
                                <option value="Data Science">Data Science</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="Web Development">Web Development</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Mobile Development">Mobile Development</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Difficulty *</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estimated Hours</label>
                            <input
                                type="number"
                                value={formData.estimated_hours}
                                onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                                placeholder={`Auto: ${totalEstimatedHours}h`}
                                min="0"
                            />
                            <small>Để trống để tự động tính từ courses ({totalEstimatedHours}h)</small>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả chi tiết về learning path này, mục tiêu học tập, và kỹ năng sẽ đạt được..."
                            rows="4"
                        />
                    </div>
                </div>

                {/* Course Selection & Ordering */}
                <div className="courses-section">
                    <div className="courses-grid">
                        {/* Available Courses */}
                        <div className="available-courses">
                            <h3>Courses có sẵn</h3>
                            <div className="courses-list">
                                {availableCourses.map(course => (
                                    <div key={course.id} className="available-course-item">
                                        <div className="course-info">
                                            <div className="course-title">{course.title}</div>
                                            <div className="course-meta">
                                                {course.category} • {course.difficulty} • {course.duration_hours}h
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => addCourse(course)}
                                            className="add-btn"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                ))}
                                {availableCourses.length === 0 && (
                                    <p className="no-courses">Tất cả courses đã được thêm vào path</p>
                                )}
                            </div>
                        </div>

                        {/* Selected Courses with Drag & Drop */}
                        <div className="selected-courses">
                            <h3>
                                Courses trong Path ({selectedCourses.length})
                                <span className="total-hours">• Tổng: {totalEstimatedHours}h</span>
                            </h3>

                            {selectedCourses.length > 0 ? (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={selectedCourses.map(c => c.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="sortable-courses">
                                            {selectedCourses.map((course, index) => (
                                                <SortableCourseItem
                                                    key={course.id}
                                                    course={course}
                                                    index={index}
                                                    onRemove={removeCourse}
                                                    onUpdateRequirement={updateCourseRequirement}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="empty-state">
                                    <p>Chưa có course nào được chọn</p>
                                    <p>Thêm courses từ danh sách bên trái để bắt đầu tạo path</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="actions">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="btn btn-secondary"
                        disabled={selectedCourses.length === 0}
                    >
                        Xem trước
                    </button>

                    <button
                        onClick={() => handleSubmit(true)}
                        className="btn btn-warning"
                        disabled={loading || !formData.title || selectedCourses.length === 0}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu nháp'}
                    </button>

                    <button
                        onClick={() => handleSubmit(false)}
                        className="btn btn-primary"
                        disabled={loading || !formData.title || selectedCourses.length === 0}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo & Publish'}
                    </button>
                </div>

                {/* Preview Modal */}
                {showPreview && (
                    <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Preview Learning Path</h3>
                                <button onClick={() => setShowPreview(false)} className="close-btn">✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="preview-section">
                                    <h4>{formData.title}</h4>
                                    <div className="preview-badges">
                                        <span className="badge">{formData.category}</span>
                                        <span className="badge">{formData.difficulty}</span>
                                        <span className="badge">{formData.estimated_hours || totalEstimatedHours}h</span>
                                    </div>
                                    <p>{formData.description}</p>
                                </div>

                                <div className="preview-section">
                                    <h4>Lộ trình học ({selectedCourses.length} courses)</h4>
                                    <div className="course-timeline">
                                        {selectedCourses.map((course, index) => (
                                            <div key={course.id} className="timeline-item">
                                                <div className="timeline-number">{index + 1}</div>
                                                <div className="timeline-content">
                                                    <h5>{course.title}</h5>
                                                    <div className="timeline-meta">
                                                        {course.duration_hours}h
                                                        {course.min_score_required && ` • Min score: ${course.min_score_required}%`}
                                                        {course.require_quiz_complete && ' • Quiz required'}
                                                        {course.require_assignments_complete && ' • Assignments required'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button onClick={() => setShowPreview(false)} className="btn btn-secondary">
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateLearningPath;
