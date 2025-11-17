import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
// TODO: add user/profile routes

export default router;
