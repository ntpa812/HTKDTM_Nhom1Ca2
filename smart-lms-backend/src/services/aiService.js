import axios from 'axios';

const API_BASE = '/api/ai';

class AIService {
    /**
     * Get AI prediction for current student
     */
    static async getStudentPrediction(userId) {
        try {
            const response = await axios.get(`${API_BASE}/student/${userId}/prediction`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get analytics and trends
     */
    static async getStudentAnalytics(userId, period = 30) {
        try {
            const response = await axios.get(`${API_BASE}/analytics/${userId}`, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Custom prediction
     */
    static async customPredict(studentData, userId = null) {
        try {
            const response = await axios.post(`${API_BASE}/predict/custom`, {
                studentData,
                userId
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Check AI service health
     */
    static async checkHealth() {
        try {
            const response = await axios.get(`${API_BASE}/health`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static handleError(error) {
        const message = error.response?.data?.message || error.message || 'AI service error';
        const status = error.response?.status || 500;
        return new Error(`AI Service Error (${status}): ${message}`);
    }
}

export default AIService;
