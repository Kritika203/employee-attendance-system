const express = require('express');
const router = express.Router();
const { login, employeeLogin } = require('../controllers/authController');

router.post('/login', login);
router.post('/employee-login', employeeLogin);

module.exports = router;