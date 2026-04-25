const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "CHANGE_ME_BEFORE_SUBMISSION";

// TODO: Implement authenticateJWT middleware for Assignment 3.
// Requirements:
// - Read the Authorization header: "Bearer <token>".
// - Verify the token using jwt.verify and SECRET.
// - If valid, attach the decoded payload to req.user.
// - If missing/invalid/expired, pass an appropriate error into next(err)
//   (do NOT send the response directly here — let errorHandler.js do that).

module.exports = function authenticateJWT(req, res, next) {
  // TODO: implement
  next(new Error("authenticateJWT not implemented yet"));
};