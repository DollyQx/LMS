const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

const router = express.Router();

// Fetch Quizzes inside a course (Student + Admin)
router
  .route('/:courseId')
  .get(protect, quizController.getQuizzesForCourse);

// Strict Admin route: Creating the Quiz & binding deep Questions
router
  .route('/')
  .post(protect, restrictTo('admin'), quizController.createQuiz);

// Strict Student scoring triggers
router
  .route('/attempt')
  .post(protect, quizController.submitAttempt);

// Historical attempt data parsing (Finding your own scores safely)
router
  .route('/result/:quizId')
  .get(protect, quizController.getAttemptResults);

module.exports = router;
