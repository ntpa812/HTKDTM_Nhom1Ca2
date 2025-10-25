// src/routes/index.js
module.exports = function (app) {
    app.use('/api/auth', require('./auth'));
    app.use('/api/courses', require('./course'));
    app.use('/api/progress', require('./progress'));
    app.use('/api/ai', require('./ai'));
};
