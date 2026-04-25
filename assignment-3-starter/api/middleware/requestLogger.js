const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
  req.requestId = uuidv4();

  console.log(
    `REQUEST ${req.requestId} ${req.method} ${req.path}`
  );

  next();
};