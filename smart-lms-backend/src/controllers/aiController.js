const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const sql = require('mssql');

class AIController {
    constructor() {
        // Path to Python ML script
        this.pythonScriptPath = path.join(__dirname, '../../smart-lms-ml/predict_for_api.py');
        this.validatePythonScript();
    }

    async validatePythonScript() {
        try {
            await fs.access(this.pythonScriptPath);
            console.log('✅ Python ML script found at:', this.pythonScriptPath);
        } catch (error) {
            console.error('❌ Python ML script not found:', this.pythonScriptPath);
        }
    }

    /**
     * 🎯 Get AI prediction for specific student
     * GET /api/ai/student/:userId/prediction
     */
    async getStudentPrediction(req, res) {
        try {
            const { userId } = req.params;
            console.log(`🚀 Getting AI prediction for user: ${userId}`);

            // Get student behavior data from database
            const studentData = await this.fetchStudentBehaviorData(userId);

            if (!studentData) {
                return res.status(404).json({
                    success: false,
                    error: 'No student behavior data found',
                    message: `No data available for student ID: ${userId}`
                });
            }

            console.log('📊 Student data retrieved:', studentData);

            // Call Python ML model
            const prediction = await this.callPythonMLModel(studentData);

            if (!prediction.success) {
                return res.status(500).json({
                    success: false,
                    error: 'AI prediction failed',
                    details: prediction.error
                });
            }

            // Save prediction result to database (optional)
            await this.savePredictionResult(userId, prediction.data);

            // Return formatted response
            res.json({
                success: true,
                studentId: parseInt(userId),
                prediction: prediction.data,
                metadata: {
                    timestamp: new Date().toISOString(),
                    model_version: prediction.data.metadata?.model_version || '1.3',
                    data_source: 'StudentBehaviors'
                }
            });

        } catch (error) {
            console.error('❌ AI prediction error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    /**
     * 🎯 Bulk predict for multiple students  
     * POST /api/ai/predict/bulk
     */
    async bulkPredict(req, res) {
        try {
            const { userIds } = req.body;

            if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user IDs array'
                });
            }

            if (userIds.length > 50) {
                return res.status(400).json({
                    success: false,
                    error: 'Too many users. Maximum 50 users per request.'
                });
            }

            console.log(`🚀 Bulk prediction for ${userIds.length} users`);

            const results = [];
            const errors = [];

            // Process predictions in parallel with limited concurrency
            const batchSize = 5;
            for (let i = 0; i < userIds.length; i += batchSize) {
                const batch = userIds.slice(i, i + batchSize);

                const batchPromises = batch.map(async (userId) => {
                    try {
                        const studentData = await this.fetchStudentBehaviorData(userId);
                        if (!studentData) {
                            throw new Error(`No data found for user ${userId}`);
                        }

                        const prediction = await this.callPythonMLModel(studentData);
                        if (prediction.success) {
                            return {
                                studentId: userId,
                                prediction: prediction.data,
                                success: true
                            };
                        } else {
                            throw new Error(prediction.error);
                        }
                    } catch (error) {
                        errors.push({
                            studentId: userId,
                            error: error.message
                        });
                        return null;
                    }
                });

                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults.filter(r => r !== null));
            }

            res.json({
                success: true,
                total_requested: userIds.length,
                successful_predictions: results.length,
                failed_predictions: errors.length,
                results: results,
                errors: errors.length > 0 ? errors : undefined,
                metadata: {
                    timestamp: new Date().toISOString(),
                    processing_time_ms: Date.now() - req.startTime
                }
            });

        } catch (error) {
            console.error('❌ Bulk prediction error:', error);
            res.status(500).json({
                success: false,
                error: 'Bulk prediction failed',
                details: error.message
            });
        }
    }

    /**
     * 🎯 Custom prediction with provided data
     * POST /api/ai/predict/custom
     */
    async customPredict(req, res) {
        try {
            const { studentData, userId } = req.body;

            // Validate required fields
            const requiredFields = [
                'StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg',
                'PlatformEngagement_Minutes', 'Motivation', 'StressLevel', 'LearningStyle'
            ];

            const missingFields = requiredFields.filter(field =>
                studentData[field] === undefined || studentData[field] === null
            );

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                    missing_fields: missingFields,
                    required_fields: requiredFields
                });
            }

            console.log('🧪 Custom prediction with provided data:', studentData);

            const prediction = await this.callPythonMLModel(studentData);

            if (!prediction.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Prediction failed',
                    details: prediction.error
                });
            }

            res.json({
                success: true,
                studentId: userId || null,
                prediction: prediction.data,
                input_data: studentData,
                metadata: {
                    timestamp: new Date().toISOString(),
                    prediction_type: 'custom',
                    model_version: prediction.data.metadata?.model_version || '1.3'
                }
            });

        } catch (error) {
            console.error('❌ Custom prediction error:', error);
            res.status(500).json({
                success: false,
                error: 'Custom prediction failed',
                details: error.message
            });
        }
    }

    /**
     * 📊 Get AI analytics for dashboard
     * GET /api/ai/analytics/:userId
     */
    async getStudentAnalytics(req, res) {
        try {
            const { userId } = req.params;
            const { period = '30' } = req.query; // days

            console.log(`📊 Getting analytics for user ${userId}, period: ${period} days`);

            // Get historical behavior data
            const historicalData = await this.fetchHistoricalBehaviorData(userId, period);

            if (!historicalData || historicalData.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'No historical data found'
                });
            }

            // Generate predictions for historical data to show trends
            const predictions = [];
            for (const data of historicalData.slice(0, 5)) { // Limit to last 5 records
                try {
                    const prediction = await this.callPythonMLModel(data);
                    if (prediction.success) {
                        predictions.push({
                            date: data.RecordedDate,
                            prediction: prediction.data.prediction_summary,
                            confidence: prediction.data.prediction_summary.confidence
                        });
                    }
                } catch (error) {
                    console.warn('Warning: Failed to predict for historical data:', error.message);
                }
            }

            // Calculate trends
            const trends = this.calculateTrends(predictions);

            res.json({
                success: true,
                studentId: parseInt(userId),
                analytics: {
                    period_days: parseInt(period),
                    total_records: historicalData.length,
                    predictions: predictions,
                    trends: trends,
                    latest_prediction: predictions[0] || null
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    data_points: predictions.length
                }
            });

        } catch (error) {
            console.error('❌ Analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate analytics',
                details: error.message
            });
        }
    }

    /**
     * 🔧 Health check for AI service
     * GET /api/ai/health
     */
    async healthCheck(req, res) {
        try {
            const healthData = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                checks: {
                    python_script: false,
                    model_files: {
                        cluster_model: false,
                        grade_model: false
                    },
                    database: false
                }
            };

            // Check Python script
            try {
                await fs.access(this.pythonScriptPath);
                healthData.checks.python_script = true;
            } catch { }

            // Check model files
            const modelDir = path.dirname(this.pythonScriptPath);
            try {
                await fs.access(path.join(modelDir, 'student_cluster_model.pkl'));
                healthData.checks.model_files.cluster_model = true;
            } catch { }

            try {
                await fs.access(path.join(modelDir, 'grade_prediction_model.pkl'));
                healthData.checks.model_files.grade_model = true;
            } catch { }

            // Check database connection
            try {
                const pool = await sql.connect();
                await pool.request().query('SELECT 1');
                healthData.checks.database = true;
            } catch { }

            // Determine overall health
            const allChecks = [
                healthData.checks.python_script,
                healthData.checks.model_files.cluster_model,
                healthData.checks.model_files.grade_model,
                healthData.checks.database
            ];

            if (allChecks.every(check => check)) {
                healthData.status = 'healthy';
            } else if (allChecks.some(check => check)) {
                healthData.status = 'degraded';
            } else {
                healthData.status = 'unhealthy';
            }

            const statusCode = healthData.status === 'healthy' ? 200 :
                healthData.status === 'degraded' ? 206 : 503;

            res.status(statusCode).json(healthData);

        } catch (error) {
            console.error('❌ Health check error:', error);
            res.status(503).json({
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    // ========== PRIVATE HELPER METHODS ==========

    /**
     * 📊 Fetch student behavior data from database
     */
    async fetchStudentBehaviorData(userId) {
        try {
            const pool = await sql.connect();
            const request = pool.request();

            const query = `
                SELECT TOP 1 
                    StudyHours, AssignmentCompletionRate, QuizScore_Avg,
                    PlatformEngagement_Minutes, LearningStyle, Motivation, 
                    StressLevel, FinalGrade, RecordedDate
                FROM StudentBehaviors 
                WHERE UserID = @userId 
                ORDER BY RecordedDate DESC
            `;

            request.input('userId', sql.Int, parseInt(userId));
            const result = await request.query(query);

            if (result.recordset.length === 0) {
                return null;
            }

            const record = result.recordset[0];

            // Format data for ML model
            return {
                StudyHours: record.StudyHours,
                AssignmentCompletionRate: record.AssignmentCompletionRate,
                QuizScore_Avg: record.QuizScore_Avg,
                PlatformEngagement_Minutes: record.PlatformEngagement_Minutes,
                Motivation: record.Motivation,
                StressLevel: record.StressLevel,
                LearningStyle: record.LearningStyle,
                // Additional metadata
                FinalGrade: record.FinalGrade,
                RecordedDate: record.RecordedDate
            };

        } catch (error) {
            console.error('❌ Database fetch error:', error);
            throw new Error(`Failed to fetch student data: ${error.message}`);
        }
    }

    /**
     * 📈 Fetch historical behavior data
     */
    async fetchHistoricalBehaviorData(userId, days = 30) {
        try {
            const pool = await sql.connect();
            const request = pool.request();

            const query = `
                SELECT 
                    StudyHours, AssignmentCompletionRate, QuizScore_Avg,
                    PlatformEngagement_Minutes, LearningStyle, Motivation, 
                    StressLevel, FinalGrade, RecordedDate
                FROM StudentBehaviors 
                WHERE UserID = @userId 
                  AND RecordedDate >= DATEADD(day, -@days, GETDATE())
                ORDER BY RecordedDate DESC
            `;

            request.input('userId', sql.Int, parseInt(userId));
            request.input('days', sql.Int, parseInt(days));

            const result = await request.query(query);
            return result.recordset;

        } catch (error) {
            console.error('❌ Historical data fetch error:', error);
            throw new Error(`Failed to fetch historical data: ${error.message}`);
        }
    }

    /**
     * 🐍 Call Python ML model
     */
    async callPythonMLModel(studentData) {
        return new Promise((resolve, reject) => {
            try {
                const inputJson = JSON.stringify(studentData);
                console.log('🐍 Calling Python ML model with:', inputJson);

                const pythonProcess = spawn('python', [
                    this.pythonScriptPath,
                    '--input', inputJson
                ], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    cwd: path.dirname(this.pythonScriptPath)
                });

                let output = '';
                let errorOutput = '';

                pythonProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        try {
                            const result = JSON.parse(output.trim());
                            console.log('✅ Python prediction successful');
                            resolve(result);
                        } catch (parseError) {
                            console.error('❌ Failed to parse Python output:', output);
                            resolve({
                                success: false,
                                error: `Failed to parse ML model output: ${parseError.message}`
                            });
                        }
                    } else {
                        console.error('❌ Python process failed:', errorOutput);
                        resolve({
                            success: false,
                            error: `ML model execution failed: ${errorOutput}`
                        });
                    }
                });

                pythonProcess.on('error', (error) => {
                    console.error('❌ Failed to start Python process:', error);
                    resolve({
                        success: false,
                        error: `Failed to execute ML model: ${error.message}`
                    });
                });

            } catch (error) {
                resolve({
                    success: false,
                    error: `ML model call failed: ${error.message}`
                });
            }
        });
    }

    /**
     * 💾 Save prediction result to database
     */
    async savePredictionResult(userId, predictionData) {
        try {
            const pool = await sql.connect();
            const request = pool.request();

            const query = `
                INSERT INTO AIPredictions (
                    UserID, PerformanceLevel, ClusterGroup, Confidence, 
                    Recommendations, CreatedAt
                ) VALUES (
                    @userId, @performanceLevel, @clusterGroup, @confidence, 
                    @recommendations, GETDATE()
                )
            `;

            request.input('userId', sql.Int, parseInt(userId));
            request.input('performanceLevel', sql.NVarChar, predictionData.prediction_summary.performance_level);
            request.input('clusterGroup', sql.Int, predictionData.prediction_summary.cluster_group);
            request.input('confidence', sql.Float, predictionData.prediction_summary.confidence);
            request.input('recommendations', sql.NVarChar, JSON.stringify(predictionData.recommendations));

            await request.query(query);
            console.log('💾 Prediction result saved to database');

        } catch (error) {
            console.warn('⚠️  Warning: Failed to save prediction result:', error.message);
            // Don't throw error - prediction can still be returned
        }
    }

    /**
     * 📈 Calculate trends from predictions
     */
    calculateTrends(predictions) {
        if (predictions.length < 2) {
            return {
                performance_trend: 'insufficient_data',
                confidence_trend: 'insufficient_data'
            };
        }

        const latest = predictions[0];
        const previous = predictions[1];

        // Simple trend calculation
        const performanceLevels = ['Trung bình', 'Khá', 'Giỏi', 'Xuất sắc'];
        const latestIndex = performanceLevels.indexOf(latest.prediction.performance_level);
        const previousIndex = performanceLevels.indexOf(previous.prediction.performance_level);

        let performance_trend = 'stable';
        if (latestIndex > previousIndex) performance_trend = 'improving';
        if (latestIndex < previousIndex) performance_trend = 'declining';

        const confidence_trend = latest.confidence > previous.confidence ? 'increasing' :
            latest.confidence < previous.confidence ? 'decreasing' : 'stable';

        return {
            performance_trend,
            confidence_trend,
            confidence_change: latest.confidence - previous.confidence
        };
    }
}

module.exports = new AIController();
