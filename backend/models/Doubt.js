
const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: false,
    trim: true,
    enum: ['Concept', 'Theory', 'Technical'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Doubt = mongoose.model('Doubt', doubtSchema);

module.exports = Doubt;
