import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import fiveaRoutes from './routes/fivea.js';
import fagerstromRoutes from './routes/fagerstrom.js';
import userRoutes from './routes/user.js';
import contentRoutes from './routes/contentRoutes.js';
import assistRoutes from './routes/assistRoutes.js';
import publicContentRoutes from './routes/publicContentRoutes.js';
import quitTrackerRoutes from './routes/quitTrackerRoutes.js';
import fiverRoutes from './routes/fiver.js';
import risksRoutes from './routes/risks.js';
import rewardsRoutes from './routes/rewards.js';
import roadblocksRoutes from './routes/roadblocks.js';
import personalRoadblocksRoutes from './routes/personalRoadblocks.js';
import yenquitChatRoutes from './routes/yenquitChat.js';
import learningProgressRoutes from './routes/learningProgress.js';
import { startChatCleanupJob } from './jobs/chatCleanupJob.js';


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/fivea', fiveaRoutes);
app.use('/api/fagerstrom', fagerstromRoutes);
app.use('/api/quit-tracker', quitTrackerRoutes);
app.use('/api/fiver', fiverRoutes);
app.use('/api/risks', risksRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/roadblocks', roadblocksRoutes);
app.use('/api/personal-roadblocks', personalRoadblocksRoutes);
// Register public content routes BEFORE admin content routes so /public doesn't hit the generic /:id handler
app.use('/api/content', publicContentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/assist', assistRoutes);
app.use('/api/yenquit-chat', yenquitChatRoutes);
app.use('/api/learning-progress', learningProgressRoutes);

// Start chat cleanup job
startChatCleanupJob();

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
