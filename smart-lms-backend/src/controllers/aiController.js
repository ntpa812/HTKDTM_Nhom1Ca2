const { spawn } = require('child_process');
const path = require('path');
const sql = require('mssql');

// Simple AI controller để tránh crash
class AIController {
    async healthCheck(req, res) {
        res.json({
            status: 'healthy',
            message: 'AI service is running',
            timestamp: new Date().toISOString()
        });
    }

    async getStudentPrediction(req, res) {
        res.json({
            success: false,
            message: 'AI prediction integrated in dashboard - use /api/dashboard endpoints'
        });
    }

    async customPredict(req, res) {
        res.json({
            success: false,
            message: 'Use dashboard endpoints for AI predictions'
        });
    }

    async bulkPredict(req, res) {
        res.json({
            success: false,
            message: 'Bulk predict not implemented yet'
        });
    }
}

module.exports = new AIController();
