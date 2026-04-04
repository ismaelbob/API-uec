const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerExternalValidator, resendVerificationValidator } = require('../validators/user.validator');

router.post('/login', authController.login);
router.get('/verify', authMiddleware, authController.verify);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.post('/register', registerExternalValidator, validate, authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', resendVerificationValidator, validate, authController.resendVerification);

module.exports = router;
