const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quiz',
      required: [true, 'A Question must belong to a specific Quiz'],
    },
    questionText: {
      type: String,
      required: [true, 'A Question must contain actual question text'],
    },
    options: {
      type: [String],
      required: [true, 'A Question must have string options'],
      validate: {
        validator: function(val) {
          return val.length >= 2;
        },
        message: 'A Question must have at least 2 options',
      }
    },
    correctAnswer: {
      type: Number, // Stores the exact integer index of the correct array element
      required: [true, 'A Question must define securely which option is correct'],
      min: 0,
    },
    marks: {
      type: Number,
      default: 1, // Standard dynamic weighting system
      min: 1,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
