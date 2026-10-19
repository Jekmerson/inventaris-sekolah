const express = require('express');
const router = express.Router();
const { login, logout, getMe, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validateLogin, validateChangePassword } = require('../middleware/validation');

router.post('/login', validateLogin, login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, validateChangePassword, changePassword);

module.exports = router;
