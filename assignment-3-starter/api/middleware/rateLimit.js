// Very simple in-memory rate limiter for demo purposes.
// Requirements (from assignment spec):
// - Track requests per IP OR per user (token), your choice.
// - Limit to RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW_SECONDS.
// - When exceeded, produce an error (429 Too Many Requests) via next(err).
// - Include a Retry-After header in the final response (set that in errorHandler).

const store = {};

module.exports = (req, res, next) => {
  const key = req.ip;
  const max = Number(process.env.RATE_LIMIT_MAX);
  const windowSec = Number(process.env.RATE_LIMIT_WINDOW_SECONDS);

  const now = Date.now();

  if (!store[key]) {
    store[key] = [];
  }

  store[key] = store[key].filter(
    t => now - t < windowSec * 1000
  );

  if (store[key].length >= max) {
    return next({
      statusCode: 429,
      error: "RateLimitError",
      message: "Too many requests",
      retryAfter: windowSec
    });
  }

  store[key].push(now);
  next();
};