const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT @@VERSION AS version');
        res.json({
            success: true,
            message: 'Database connected',
            version: result.recordset[0].version
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// Import routes (sẽ tạo sau)
// const userRoutes = require('./routes/users');
// app.use('/api/users', userRoutes);

module.exports = app;


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Smart LMS Backend API');
});

// Import routes
require('./routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const coursesRouter = require('./routes/courses');
const analyticsRouter = require('./routes/analytics');
app.use('/api/courses', coursesRouter);
app.use('/api/analytics', analyticsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);