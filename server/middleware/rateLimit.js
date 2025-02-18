import { createHash } from 'crypto';

const requestCounts = new Map();
const resetInterval = 60 * 60 * 1000; // 1 hour in milliseconds

export function apiRateLimit(limit = 60) {
  return (req, res, next) => {
    const ip = req.ip;
    const user = req.user ? req.user.username : 'anonymous';
    
    // Create identifier (hash IP for anonymity in logs)
    const identifier = req.user ? user : createHash('sha256').update(ip).digest('hex').substring(0, 10);
    
    // Initialize or get current count
    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, {
        count: 0,
        resetTime: Date.now() + resetInterval
      });
      
      // Set timer to clear the entry
      setTimeout(() => {
        requestCounts.delete(identifier);
      }, resetInterval);
    }
    
    const requestData = requestCounts.get(identifier);
    
    // Reset if time expired
    if (Date.now() > requestData.resetTime) {
      requestData.count = 0;
      requestData.resetTime = Date.now() + resetInterval;
    }
    
    // Increment count
    requestData.count++;
    
    // Set headers
    res.set('X-RateLimit-Limit', limit);
    res.set('X-RateLimit-Remaining', Math.max(0, limit - requestData.count));
    res.set('X-RateLimit-Reset', Math.ceil(requestData.resetTime / 1000));
    
    // Check if over limit
    if (requestData.count > limit) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'You have exceeded the API rate limit. Please try again later.',
        retryAfter: Math.ceil((requestData.resetTime - Date.now()) / 1000)
      });
    }
    
    next();
  };
}