const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const e = new Error("No Authorization Header attached");
      e.statusCode = 401;
      throw e;
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, "secretPayLoad");

    if (!decodedToken) {
      const e = new Error("Authorization middleware did not work");
      e.statusCode = 500;
      throw e;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
