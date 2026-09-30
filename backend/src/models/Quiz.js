const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A Quiz must have a title'],
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'A Quiz must be linked to a Course'],
    },
    moduleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Module',
      // Optional: Can be tied directly to a Course without needing a specific module
    },
    questions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Cascade delete tied questions when a quiz is deleted natively
quizSchema.pre('findOneAndDelete', async function (next) {
  const quizId = this.getQuery()['_id'];
  const Question = mongoose.model('Question');
  const Attempt = mongoose.model('Attempt');
  
  // Wipe associated data
  await Question.deleteMany({ quizId: quizId });
  await Attempt.deleteMany({ quizId: quizId });
  
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
