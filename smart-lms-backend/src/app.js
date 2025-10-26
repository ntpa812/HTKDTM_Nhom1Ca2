require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { poolPromise } = require('../config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Root endpoint
app.get('/', (req, res) => {
    res.send('Smart LMS Backend API');
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT @@VERSION AS version');
        res.json({
            success: true,
            message: 'Database connected',
            version: result.recordset && result.recordset[0] ? result.recordset[0].version : null
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || err
        });
    }
});

// Register API routes
const apiRoutes = require('./routes');  // Import router object
app.use('/api', apiRoutes);  // Mount under /api

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
