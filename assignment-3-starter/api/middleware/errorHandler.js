// Centralized error handler.
// This should be the LAST app.use(...) in server.js.

module.exports = function errorHandler(err, req, res, next) {
  // TODO: Implement centralized error handling.
  // Requirements:
  // - Do NOT leak stack traces or internal details to the client.
  // - Always return a consistent JSON structure, e.g.:
  //   { error, message, statusCode, requestId, timestamp }
  // - Use correct HTTP status codes based on the type of error
  //   (you can attach a statusCode on your custom error objects).
  // - Include req.requestId in the response if available.

  console.error("Unhandled error for request", req.requestId, err);

  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred.",
    statusCode: 500,
    requestId: req.requestId || null,
    timestamp: new Date().toISOString()
  });
};