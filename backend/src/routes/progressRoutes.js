const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const getProgress = (req, res) => res.status(200).json({ status: 'success', message: 'Get progress' });

router.route('/')
  .get(protect, getProgress);

module.exports = router;
