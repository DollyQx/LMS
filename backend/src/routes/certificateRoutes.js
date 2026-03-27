const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const certificateController = require('../controllers/certificateController');

const router = express.Router();

router
  .route('/generate')
  .post(protect, certificateController.generateCertificate);

router
  .route('/:courseId')
  .get(protect, certificateController.getCertificate);

module.exports = router;
