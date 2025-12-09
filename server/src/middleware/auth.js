import { verifyAccessToken } from '../utils/token.js';

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Auth middleware - Token:', token ? 'Token exists' : 'No token');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const payload = verifyAccessToken(token);
    console.log('Auth middleware - Token payload:', payload);
    req.user = payload;
    console.log('Auth middleware - req.user set to:', req.user);
    next();
  } catch (err) {
    console.log('Auth middleware - Token verification error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
}
