// Generic authorization middleware that accepts a policy function.
// The policy function will receive (user, resource) and must return true/false.

module.exports = policy => {
  return (req, res, next) => {
    if (!policy(req.user, req.mail)) {
      return next({
        statusCode: 403,
        error: "Forbidden",
        message: "Access denied"
      });
    }
    next();
  };
};