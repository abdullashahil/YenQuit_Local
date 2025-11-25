import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

// Regular user routes (authenticated users)
router.get('/me', authenticateJWT, userController.getMe);
router.put('/me/profile', authenticateJWT, userController.updateMyProfile);

// User profile routes (dedicated endpoints)
router.get('/profile', authenticateJWT, userController.getProfile);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.post('/logout', authenticateJWT, userController.logout);
router.post('/upload-avatar', authenticateJWT, uploadAvatar, userController.uploadAvatar);

// Admin user management routes (admin only)
router.use('/admin', requireAdmin); // Apply admin middleware to all /admin routes

// Admin user CRUD operations
router.post('/admin/users', userController.createUser);
router.get('/admin/users', userController.getAllUsers);
router.get('/admin/users/stats', userController.getUserStats);
router.get('/admin/users/:id', userController.getUserById);
router.put('/admin/users/:id', userController.updateUser);
router.put('/admin/users/:id/avatar', uploadAvatar, userController.updateUser);
router.delete('/admin/users/:id', userController.deleteUser);

export default router;
