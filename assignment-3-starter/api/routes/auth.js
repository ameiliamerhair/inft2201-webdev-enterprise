const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "CHANGE_ME_BEFORE_SUBMISSION";

// POST /login
// Body: { username, password }
// On success: return a JWT that includes { userId, role } as claims.
router.post("/login", (req, res, next) => {
  // TODO: implement:
  // - Look up user in users.js
  // - Check password (plain text is fine for this assignment)
  // - If invalid, pass an appropriate auth error into next(err)
  // - If valid, sign a JWT and return { token }
  next(new Error("Login endpoint not implemented yet"));
});

module.exports = router;