const axios = require('axios');

// Assuming your app runs on port 3000 (adjust if different)
const API_URL = 'http://localhost:3000';

async function testAI() {
    console.log('🧪 Testing AI Integration...');

    try {
        // 1. Health check
        console.log('\n1. AI Health Check...');
        const health = await axios.get(`${API_URL}/api/ai/health`);
        console.log('Status:', health.data.status);

        // 2. Student prediction (User 5)
        console.log('\n2. Student Prediction (User 5)...');
        const prediction = await axios.get(`${API_URL}/api/ai/student/5/prediction`);
        console.log('Result:', prediction.data.prediction?.prediction_summary || prediction.data);

        // 3. Custom prediction
        console.log('\n3. Custom Prediction...');
        const custom = await axios.post(`${API_URL}/api/ai/predict/custom`, {
            studentData: {
                StudyHours: 17,
                AssignmentCompletionRate: 88,
                QuizScore_Avg: 49,
                PlatformEngagement_Minutes: 4080,
                Motivation: 2,
                StressLevel: 1,
                LearningStyle: 3
            }
        });
        console.log('Result:', custom.data.prediction?.prediction_summary || custom.data);

        console.log('\n✅ AI Integration working!');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testAI();
