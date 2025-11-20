import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import assessmentsRoutes from './routes/assessments.js';
import quitPlansRoutes from './routes/quitPlans.js';
import adviceRoutes from './routes/advice.js';
import fiveRRoutes from './routes/fiveR.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/quit-plans', quitPlansRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/5r', fiveRRoutes);
app.use('/api/admin', adminRoutes);
import userRoutes from './routes/user.js';
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
