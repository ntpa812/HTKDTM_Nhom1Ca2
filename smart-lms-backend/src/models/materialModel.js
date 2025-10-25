// src/models/materialModel.js
const mongoose = require('../utils/mongodb');
const MaterialSchema = new mongoose.Schema({
    title: String,
    url: String
});
module.exports = mongoose.model('Material', MaterialSchema);
