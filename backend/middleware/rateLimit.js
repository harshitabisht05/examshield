// Simple in-memory rate limiter
const requestCounts = {};

const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const key = `${req.ip}`;
    const now = Date.now();

    if (!requestCounts[key]) {
      requestCounts[key] = [];
    }

    // Remove old requests outside the window
    requestCounts[key] = requestCounts[key].filter((time) => now - time < windowMs);

    if (requestCounts[key].length >= maxRequests) {
      return res.status(429).json({ error: "Too many requests, please try again later" });
    }

    requestCounts[key].push(now);
    next();
  };
};

// Stricter rate limit for auth routes
const authRateLimit = rateLimit(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// General API rate limit
const apiRateLimit = rateLimit(1 * 60 * 1000, 30); // 30 requests per minute

module.exports = {
  rateLimit,
  authRateLimit,
  apiRateLimit
};
