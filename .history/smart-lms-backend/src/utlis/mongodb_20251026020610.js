// src/utils/mongodb.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/smart_lms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB error:', err));
db.once('open', () => console.log('Kết nối MongoDB thành công!'));
module.exports = mongoose;
