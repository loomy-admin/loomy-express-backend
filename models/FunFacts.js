const mongoose = require('mongoose');

const funFactSchema = new mongoose.Schema({
    text: { type: String, required: true },
    gradeRange: { type: [Number], required: true },
    ageRange: { type: [Number], required: true },
    createdAt: { type: String },
    updatedAt: { type: String },
});

module.exports = mongoose.model('fun-facts', funFactSchema);
