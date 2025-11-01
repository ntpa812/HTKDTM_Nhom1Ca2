import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import './LearningPath.css';
import RecommendationCard from '../components/common/RecommendationCard';

const API_BASE_URL = 'http://localhost:5000/api';

function LearningPath() {
    const navigate = useNavigate();
    const [allPaths, setAllPaths] = useState([]);
    const [filteredPaths, setFilteredPaths] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        difficulty: 'all',
        duration: 'all'
    });
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '⭐';
        }
        if (hasHalfStar && fullStars < 5) {
            stars += '⭐';
        }

        return stars || '⭐⭐⭐⭐⭐';
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return '#10b981';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchLearningPaths();
        fetchRecommendations();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [allPaths, filters, sortBy, searchTerm]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/learning-paths/categories`);
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories(['Web Development', 'Data Science', 'AI/ML', 'Mobile Development', 'DevOps', 'Programming']);
        }
    };

    const fetchLearningPaths = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};

            const response = await axios.get(`${API_BASE_URL}/learning-paths`, config);

            if (response.data.success) {
                const pathsData = response.data.data.paths.map(path => ({
                    id: path.id,
                    title: path.title,
                    description: path.description,
                    category: path.category,
                    difficulty: path.difficulty,
                    coursesCount: path.courses_count,
                    enrolledCount: path.enrollment_count,
                    estimatedHours: path.estimated_hours,
                    isEnrolled: path.is_enrolled === 1,
                    progress: Math.round(path.user_progress || 0),
                    instructor: path.instructor_name,
                    rating: path.avg_rating,
                    totalRatings: path.total_ratings,
                    createdAt: path.created_at,
                    popularity: path.enrollment_count,
                    tags: []
                }));

                setAllPaths(pathsData);
            }
        } catch (error) {
            console.error('Error fetching learning paths:', error);
            const mockPaths = [
                {
                    id: 1,
                    title: "Full-Stack Web Development",
                    description: "Lộ trình từ Frontend đến Backend với React và Node.js",
                    category: "Web Development",
                    difficulty: "Intermediate",
                    coursesCount: 6,
                    enrolledCount: 124,
                    estimatedHours: 180,
                    isEnrolled: true,
                    progress: 65,
                    instructor: "Dr. Nguyễn Văn Minh",
                    rating: 4.8,
                    totalRatings: 87,
                    createdAt: "2024-10-15",
                    popularity: 124,
                    tags: ["React", "Node.js", "JavaScript"]
                }
            ];
            setAllPaths(mockPaths);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...allPaths];

        if (searchTerm) {
            filtered = filtered.filter(path =>
                path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                path.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (filters.status) {
            case 'enrolled':
                filtered = filtered.filter(path => path.isEnrolled);
                break;
            case 'available':
                filtered = filtered.filter(path => !path.isEnrolled);
                break;
            default:
                break;
        }

        if (filters.category !== 'all') {
            filtered = filtered.filter(path => path.category === filters.category);
        }

        if (filters.difficulty !== 'all') {
            filtered = filtered.filter(path => path.difficulty === filters.difficulty);
        }

        switch (filters.duration) {
            case 'short':
                filtered = filtered.filter(path => path.estimatedHours <= 100);
                break;
            case 'medium':
                filtered = filtered.filter(path => path.estimatedHours > 100 && path.estimatedHours <= 200);
                break;
            case 'long':
                filtered = filtered.filter(path => path.estimatedHours > 200);
                break;
            default:
                break;
        }

        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                filtered.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'shortest':
                filtered.sort((a, b) => a.estimatedHours - b.estimatedHours);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        setFilteredPaths(filtered);
    };

    const handleEnroll = async (pathId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vui lòng đăng nhập để đăng ký learning path');
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}/learning-paths/${pathId}/enroll`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setAllPaths(paths =>
                    paths.map(path =>
                        path.id === pathId
                            ? { ...path, isEnrolled: true, enrolledCount: path.enrolledCount + 1 }
                            : path
                    )
                );
                alert('Đăng ký learning path thành công!');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            alert('Lỗi khi đăng ký: ' + (error.response?.data?.message || error.message));
        }
    };

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; // Không lấy gợi ý nếu chưa đăng nhập

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/learning-paths/recommendations`, config);

            if (response.data.success) {
                setRecommendations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const resetFilters = () => {
        setFilters({
            status: 'all',
            category: 'all',
            difficulty: 'all',
            duration: 'all'
        });
        setSearchTerm('');
        setSortBy('newest');
    };

    if (loading) {
        return (
            <Layout title="Lộ trình học tập" subtitle="Đang tải dữ liệu...">
                <div className="loadingContainer">
                    <div className="loadingSpinner">🔄</div>
                    <p>Đang tải Learning Paths từ database...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Lộ trình học tập" subtitle="Khám phá các lộ trình học tập có cấu trúc">
            <div className="learning-page-grid">
                <aside className="filters-column">
                    <div className="filtersSection">
                        <div className="searchContainer">
                            <input
                                type="text"
                                placeholder="🔍 Tìm kiếm learning path..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="searchInput"
                            />
                        </div>

                        <div className="filterControls">
                            <div className="filterGroup">
                                <label className="filterLabel">Trạng thái:</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="filterSelect"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="enrolled">Đã đăng ký</option>
                                    <option value="available">Có thể đăng ký</option>
                                </select>
                            </div>

                            <div className="filterGroup">
                                <label className="filterLabel">Category:</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="filterSelect"
                                >
                                    <option value="all">Tất cả</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filterGroup">
                                <label className="filterLabel">Difficulty:</label>
                                <select
                                    value={filters.difficulty}
                                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                                    className="filterSelect"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="filterGroup">
                                <label className="filterLabel">Sắp xếp:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="filterSelect"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="popular">Phổ biến nhất</option>
                                    <option value="shortest">Thời gian ngắn nhất</option>
                                    <option value="rating">Đánh giá cao nhất</option>
                                </select>
                            </div>

                            <button className="resetBtn" onClick={resetFilters}>
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="main-column">
                    {recommendations.length > 0 && (
                        <div className="recommendations-section">
                            <h3 className="section-title">✨ Gợi ý dành riêng cho bạn</h3>
                            <div className="recommendations-grid">
                                {recommendations.map(path => (
                                    <RecommendationCard key={`rec-${path.id}`} path={path} />
                                ))}
                            </div>
                        </div>
                    )}
                    <section className="paths-list-section">
                        <div className="resultsInfo">
                            <span>
                                Hiển thị {filteredPaths.length} trong số {allPaths.length} learning paths
                            </span>
                        </div>

                        {filteredPaths.length > 0 ? (
                            <div className="pathsGrid">
                                {filteredPaths.map(path => (
                                    <div key={path.id} className="pathCard">
                                        <div className="cardHeader">
                                            <div className="cardTitle">{path.title}</div>
                                            <div
                                                className="difficultyBadge"
                                                style={{ backgroundColor: getDifficultyColor(path.difficulty) }}
                                            >
                                                {path.difficulty}
                                            </div>
                                        </div>

                                        <div className="cardContent">
                                            <p className="cardDescription">{path.description}</p>

                                            <div className="instructorRow">
                                                <div className="instructorInfo">
                                                    👨‍🏫 {path.instructor}
                                                </div>
                                                <div className="ratingInfo">
                                                    <span className="stars">
                                                        {renderStars(path.rating)}
                                                    </span>
                                                    <span className="ratingText">
                                                        {path.rating} ({path.totalRatings})
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="cardMeta">
                                                <div className="metaItem">📚 {path.coursesCount} courses</div>
                                                <div className="metaItem">👥 {path.enrolledCount} enrolled</div>
                                                <div className="metaItem">⏱️ {path.estimatedHours}h</div>
                                                <div className="metaItem">🏷️ {path.category}</div>
                                            </div>

                                            {path.isEnrolled && path.progress > 0 && (
                                                <div className="progressSection">
                                                    <div className="progressLabel">
                                                        Tiến độ: {path.progress}%
                                                    </div>
                                                    <div className="progressBar">
                                                        <div
                                                            className="progressFill"
                                                            style={{ width: `${path.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="cardActions">
                                            <button
                                                className="detailButton"
                                                onClick={() => navigate(`/learning-paths/${path.id}`)}
                                            >
                                                Xem chi tiết
                                            </button>

                                            {!path.isEnrolled ? (
                                                <button
                                                    className="enrollButton"
                                                    onClick={() => handleEnroll(path.id)}
                                                >
                                                    Đăng ký học
                                                </button>
                                            ) : (
                                                <button
                                                    className="continueButton"
                                                    onClick={() => navigate(`/learning-paths/${path.id}/continue`)}
                                                >
                                                    Tiếp tục học
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="emptyState">
                                <div className="emptyIcon">🔍</div>
                                <h3 className="emptyTitle">Không tìm thấy learning path nào</h3>
                                <p className="emptyText">
                                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </p>
                                <button className="resetBtn" onClick={resetFilters}>
                                    🔄 Reset bộ lọc
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </Layout >
    );
}

export default LearningPath;
