const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refresh);

// Protected routes (require user to at least hold a valid access token or be passing a request from front end)
// Wait: logout requires standard cookie clear but we can optionally protect it to grab req.user
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;
