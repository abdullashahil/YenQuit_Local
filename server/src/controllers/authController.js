import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import * as activityService from '../services/activityService.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';

export async function register(req, res, next) {
  try {
    const { email, password, role, profile } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await authService.registerUserWithProfile({ email, password, role, profile: profile || {} });
    const accessToken = generateAccessToken({ userId: result.user.id, role: result.user.role });
    const refreshToken = generateRefreshToken({ userId: result.user.id, role: result.user.role });

    // Log activity
    try {
      await activityService.logActivity(
        result.user.id,
        'user_registered',
        'New user registration',
        req.ip,
        req.get('user-agent')
      );
    } catch (e) {
      // non-blocking
    }

    res.status(201).json({ user: { ...result.user, profile: result.profile }, accessToken, refreshToken });
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
    // update last_login (non-blocking)
    userService.updateLastLogin(user.id).catch(() => {});
    // log activity (non-blocking)
    activityService
      .logActivity(user.id, 'user_login', 'User logged in', req.ip, req.get('user-agent'))
      .catch(() => {});
    delete user.password_hash;
    res.json({ user, accessToken, refreshToken });
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
