const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An Attempt must be tied strictly to a User'],
    },
    quizId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quiz',
      required: [true, 'An Attempt must target a specific Quiz'],
    },
    answers: {
      type: [Number],
      required: [true, 'An attempt payload must contain the submitted answers array'],
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Creates an isolated performance index tracking user queries to find their personal attempts rapidly.
attemptSchema.index({ userId: 1, quizId: 1 });

const Attempt = mongoose.model('Attempt', attemptSchema);
module.exports = Attempt;
