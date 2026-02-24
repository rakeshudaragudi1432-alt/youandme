const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// Define routes mapped to controller methods
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
