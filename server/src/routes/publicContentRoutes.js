import { Router } from 'express';
import { getPublicContent, getPublicContentById } from '../controllers/publicContentController.js';

const router = Router();

// GET /api/content/public
router.get('/public', getPublicContent);

// GET /api/content/public/:id
router.get('/public/:id', getPublicContentById);

export default router;
