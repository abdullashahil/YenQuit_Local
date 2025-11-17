import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
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
