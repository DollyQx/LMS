const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const lessonController = require('../controllers/lessonController');

const router = express.Router();

router
  .route('/:moduleId')
  .get(protect, lessonController.getLessonsForModule);

router
  .route('/')
  .post(protect, restrictTo('admin'), lessonController.createLesson);

module.exports = router;
