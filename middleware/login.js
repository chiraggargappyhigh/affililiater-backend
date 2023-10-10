/**
 * loginUser.js
 * @description :: middleware that verifies JWT token of user
 */

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { PLATFORM } = require("../constants/auth");

const publicKey = fs.readFileSync(
  path.join(__dirname, "..", "secrets", "public.pem")
);

/**
 * @description : middleware for authenticate user with JWT token
 * @param {Object} req : request of route.
 * @param {Object} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      console.log(token);

      const payload = jwt.verify(token.trim(), publicKey);
      console.log(payload);

      req.user = payload;
      next();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authenticateJWT;
