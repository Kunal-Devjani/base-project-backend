const express = require('express');
const router = express.Router();
const controller = require('./lib/controller');
const auth = require('../../middleware/middleware');
const { userRegisterValidation, loginValidation } = require('./lib/validation');
const { expressValidate } = require('../../../utils/lib/common-function');

// Customer Registration
router.post('/register/customer', userRegisterValidation(), expressValidate, controller.userRegister);

// Admin Registration
router.post('/register/admin', userRegisterValidation(), expressValidate, controller.userRegister);

// Email Verification
router.post('/verify/email', expressValidate, controller.verifyEmail);

// Resend Verification
router.put('/resend-verification', controller.resendVerificationCode);

// Admin Login Route
router.post('/login/admin', loginValidation(), expressValidate, controller.login);

// Customer Login Route
router.post('/login/customer', loginValidation(), expressValidate, controller.login);

module.exports = router;
