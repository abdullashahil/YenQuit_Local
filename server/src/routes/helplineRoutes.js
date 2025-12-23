import express from 'express';
import { getHelplines, createHelpline, updateHelpline, deleteHelpline } from '../controllers/helplineController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

/**
 * @route GET /api/helplines
 * @desc Get all active helplines
 * @access Public
 */
router.get('/', getHelplines);

/**
 * @route POST /api/helplines
 * @desc Create a new helpline
 * @access Admin
 */
router.post('/', authenticateJWT, requireAdmin, createHelpline);

/**
 * @route PUT /api/helplines/:id
 * @desc Update a helpline
 * @access Admin
 */
router.put('/:id', authenticateJWT, requireAdmin, updateHelpline);

/**
 * @route DELETE /api/helplines/:id
 * @desc Delete a helpline
 * @access Admin
 */
router.delete('/:id', authenticateJWT, requireAdmin, deleteHelpline);

export default router;
