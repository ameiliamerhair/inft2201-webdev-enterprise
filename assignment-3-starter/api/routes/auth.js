const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users");

const router = express.Router();

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return next({
      statusCode: 401,
      error: "AuthenticationError",
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;