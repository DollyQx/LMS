const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const moduleController = require('../controllers/moduleController');

const router = express.Router();

// Fetching all modules implicitly relies on knowing which course to fetch them for
router
  .route('/:courseId')
  .get(protect, moduleController.getModulesForCourse);

// Creating modules can be standalone if the payload has courseId
router
  .route('/')
  .post(protect, restrictTo('admin'), moduleController.createModule);

module.exports = router;
