// routes/prediction.js
app.post('/api/predict-student', async (req, res) => {
    try {
        const studentData = req.body;

        // Gọi Python predict service
        const prediction = await callPythonPredict(studentData);

        // Format cho frontend
        const formatted = formatForAIPredictionCard(prediction);

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

function formatForAIPredictionCard(prediction) {
    return {
        cluster: prediction.cluster[0],
        grade: prediction.predicted_grade[0],
        confidence: prediction.grade_probabilities[0],
        recommendations: generateRecommendations(prediction)
    };
}
