import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function register(req, res, next) {
  try {
    const { email, password, role, profile } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await authService.registerUserWithProfile({ email, password, role, profile: profile || {} });
    res.status(201).json({ user: result.user, profile: result.profile });
  } catch (err) {
    if (err.code === '23505') {
      // Unique violation (email exists)
      return res.status(409).json({ error: 'Email already registered' });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });
    delete user.password_hash;
    const completed = !!user.onboarding_completed;
    const rawStep = user.onboarding_step;
    const step = completed ? 5 : (Number.isInteger(rawStep) ? rawStep : 0);
    const requiresOnboarding = !completed && step < 5;
    res.json({ user, accessToken, refreshToken, requiresOnboarding, currentStep: step });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const accessToken = generateAccessToken({ userId: payload.userId, role: payload.role });
res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

// Google OAuth functions
export async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Email is required from Google account' });
    }

    // Check if user exists
    let user = await userService.findUserByEmail(email);
    
    if (user) {
      // User exists, login them
      const accessToken = generateAccessToken({ userId: user.id, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });
      delete user.password_hash;
      
      const completed = !!user.onboarding_completed;
      const rawStep = user.onboarding_step;
      const step = completed ? 5 : (Number.isInteger(rawStep) ? rawStep : 0);
      const requiresOnboarding = !completed && step < 5;
      
      res.json({ 
        user, 
        accessToken, 
        refreshToken, 
        requiresOnboarding, 
        currentStep: step,
        isNewUser: false 
      });
    } else {
      // New user, create account
      const profile = {
        full_name: name || '',
        avatar_url: picture || null,
        google_id: googleId,
        metadata: {
          signup_method: 'google',
          providedEmail: email
        }
      };

      const result = await authService.registerUserWithProfile({ 
        email, 
        password: Math.random().toString(36).slice(-16), // Random password for Google users
        role: 'user', 
        profile 
      });

      const newUser = result.user;
      const accessToken = generateAccessToken({ userId: newUser.id, role: newUser.role });
      const refreshToken = generateRefreshToken({ userId: newUser.id, role: newUser.role });
      delete newUser.password_hash;

      res.json({ 
        user: newUser, 
        accessToken, 
        refreshToken, 
        requiresOnboarding: true, 
        currentStep: 0,
        isNewUser: true 
      });
    }
  } catch (err) {
    console.error('Google auth error:', err);
    if (err.message.includes('Invalid token')) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }
    next(err);
  }
}

export async function googleAuthCallback(req, res, next) {
  // This is for server-side OAuth flow (if needed in the future)
  res.json({ message: 'Google OAuth callback endpoint' });
}
