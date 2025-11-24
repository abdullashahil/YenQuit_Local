import express from 'express';
import ContentController from '../controllers/contentController.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// POST /api/content - Create new content (with file upload support)
router.post('/', uploadSingle, handleUploadError, ContentController.createContent);

// GET /api/content - Get all content with pagination and filtering
router.get('/', ContentController.getAllContent);

// GET /api/content/stats - Get content statistics
router.get('/stats', ContentController.getContentStats);

// GET /api/content/:id - Get single content by ID
router.get('/:id', ContentController.getContentById);

// PUT /api/content/:id - Update content (with file upload support)
router.put('/:id', uploadSingle, handleUploadError, ContentController.updateContent);

// DELETE /api/content/:id - Delete content
router.delete('/:id', ContentController.deleteContent);

export default router;
