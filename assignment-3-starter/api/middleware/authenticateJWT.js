const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return next({
      statusCode: 401,
      error: "AuthError",
      message: "Missing token"
    });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next({
      statusCode: 401,
      error: "AuthError",
      message: "Invalid or expired token"
    });
  }
};