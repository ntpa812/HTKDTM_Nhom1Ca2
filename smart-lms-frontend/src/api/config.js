const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
    },
    courses: {
        getAll: `${API_BASE_URL}/courses`,
        getById: (id) => `${API_BASE_URL}/courses/${id}`,
    },
    progress: {
        getByUser: (userId) => `${API_BASE_URL}/progress/${userId}`,
        update: `${API_BASE_URL}/progress/update`,
    },
    ai: {
        recommend: `${API_BASE_URL}/ai/recommend`,
    },
    analytics: {
        overview: `${API_BASE_URL}/analytics/overview`,
    }
};

export default API_BASE_URL;
