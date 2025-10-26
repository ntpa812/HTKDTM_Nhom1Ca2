// src/utlis/mongodb.js
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/smart_lms';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`✅ Connected to MongoDB: ${mongoUrl}`))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB error:', err));
db.once('open', () => console.log('Kết nối MongoDB thành công!'));
module.exports = mongoose;
