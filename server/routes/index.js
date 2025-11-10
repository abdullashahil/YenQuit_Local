import express from 'express';

const router = express.Router();

// API version and info
router.get('/', (req, res) => {
  res.json({
    message: 'YenQuit API v1',
    version: '1.0.0',
  });
});

export default router;
