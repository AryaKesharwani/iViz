
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 4 options'],
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return this.options.includes(value);
      },
      message: 'Correct answer must be one of the options',
    },
  },
  time: {
    type: Number,
    required: true,
    min: 1, // Minimum time limit in seconds
  },
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 4;
}

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
