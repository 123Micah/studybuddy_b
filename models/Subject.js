// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
