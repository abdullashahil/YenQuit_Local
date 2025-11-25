import { authenticateJWT } from './auth.js';

export function requireAdmin(req, res, next) {
  // First authenticate the user
  authenticateJWT(req, res, (err) => {
    if (err) return next(err);
    
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required',
        message: 'This endpoint is only accessible to administrators' 
      });
    }
    
    next();
  });
}
