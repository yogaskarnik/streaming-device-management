const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const nokiaApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit Nokia API calls
  message: 'Nokia API rate limit exceeded, please try again later.',
});

module.exports = { apiLimiter, nokiaApiLimiter };
