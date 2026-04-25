// Centralized error handler.
// This should be the LAST app.use(...) in server.js.

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  console.error(
    `Unhandled error for request ${req.requestId}`,
    err
  );

  if (err.retryAfter) {
    res.set("Retry-After", err.retryAfter);
  }

  res.status(status).json({
    error: err.error || "ServerError",
    message: err.message || "Something went wrong",
    statusCode: status,
    requestId: req.requestId || null,
    timestamp: new Date().toISOString()
  });
};