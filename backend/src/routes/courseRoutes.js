const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const courseController = require('../controllers/courseController');

const router = express.Router();

router
  .route('/')
  .get(protect, courseController.getAllCourses) // Only authenticated users view
  .post(protect, restrictTo('admin'), courseController.createCourse);

router
  .route('/:id')
  .get(protect, courseController.getCourseById)
  .put(protect, restrictTo('admin'), courseController.updateCourse)
  .delete(protect, restrictTo('admin'), courseController.deleteCourse);

module.exports = router;
