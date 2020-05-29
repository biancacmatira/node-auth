const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// @route   GET /login
// @desc    Login page
// @access  Public
router.get('/login', authController.getLogin);

// @route   POST /login
// @desc    Authenticate a user
// @access  Public
router.post('/login', authController.postLogin);

// @route   POST /logout
// @desc    Un-authenticate a user
// @access  Public
router.post('/logout', authController.postLogout);

module.exports = router;