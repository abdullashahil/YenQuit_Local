import { verifyAccessToken } from '../utils/token.js';

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = verifyAccessToken(token);

    // Check for legacy UUID tokens (migration to integer IDs)
    // If userId is a string that looks like a UUID (length > 20) or not a valid number
    const userId = payload.userId;
    const isLegacyUuid = typeof userId === 'string' && userId.length > 20;
    const isInvalidNumber = (typeof userId === 'number' && isNaN(userId));

    if (isLegacyUuid || isInvalidNumber) {
      return res.status(401).json({ error: 'Token invalidated due to system update. Please log in again.' });
    }

    req.user = payload;
    next();
  } catch (err) {
    // Token verification failed
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
}
