// const { sql, poolPromise } = require('./utils/mssql');
// require('./utils/mongodb');
// require('./utils/mssql');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

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
