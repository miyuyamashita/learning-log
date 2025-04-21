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

    if (!token) {
      const e = new Error(
        "Token not provided in expected format: 'Bearer <token>'"
      );
      e.statusCode = 401;
      throw e;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
