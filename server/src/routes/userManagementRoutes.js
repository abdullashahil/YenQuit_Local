import express from 'express';
import * as userManagementController from '../controllers/userManagementController.js';
import { requireAdmin } from '../middleware/admin.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// POST /api/admin/users - Create new user
router.post('/', userManagementController.createUser);

// GET /api/admin/users - Get all users with pagination and filters
router.get('/', userManagementController.getAllUsers);

// GET /api/admin/users/stats - Get user statistics
router.get('/stats', userManagementController.getUserStats);

// GET /api/admin/users/:id - Get user by ID
router.get('/:id', userManagementController.getUserById);

// PUT /api/admin/users/:id - Update user
router.put('/:id', userManagementController.updateUser);

// PUT /api/admin/users/:id/avatar - Update user avatar
router.put('/:id/avatar', uploadAvatar, userManagementController.updateUser);

// DELETE /api/admin/users/:id - Delete user
router.delete('/:id', userManagementController.deleteUser);

export default router;
