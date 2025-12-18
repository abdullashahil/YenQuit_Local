import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Email check endpoint (must be before /register to avoid route conflicts)
router.get('/check-email/:email', authController.checkEmailExists);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Google OAuth routes
router.post('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

export default router;
