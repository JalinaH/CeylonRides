import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token." });
    }
    return res
      .status(401)
      .json({ error: "Unauthorized: Token verification failed." });
  }
};

export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (user.role === "admin") {
        next();
      } else {
        return res
          .status(403)
          .json({ error: "Forbidden: Admin access required." });
      }
    } catch (error) {
      console.error("Admin verification DB error:", error);
      return res
        .status(500)
        .json({ error: "Server error during admin verification." });
    }
  });
};

export const verifyDriver = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      if (user.role === "driver" || user.role === "admin") {
        next();
      } else {
        return res
          .status(403)
          .json({ error: "Forbidden: Driver access required." });
      }
    } catch (error) {
      console.error("Driver verification DB error:", error);
      return res
        .status(500)
        .json({ error: "Server error during driver verification." });
    }
  });
};
