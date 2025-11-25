import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import fiveaRoutes from './routes/fivea.js';
import fagerstromRoutes from './routes/fagerstrom.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
import userRoutes from './routes/user.js';
app.use('/api/users', userRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/fivea', fiveaRoutes);
app.use('/api/fagerstrom', fagerstromRoutes);

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
