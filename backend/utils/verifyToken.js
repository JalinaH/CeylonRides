// utils/verifyToken.js (Create this file/folder if it doesn't exist)
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Get token from header (common practice) or cookies
  const token = req.headers.authorization?.split(" ")[1]; // Expects "Bearer TOKEN" format

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }

  // 2. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user ID to the request object
    req.userId = decoded.userId; // The payload field name used during signing
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token." });
    }
    // Other potential errors
    return res
      .status(401)
      .json({ error: "Unauthorized: Token verification failed." });
  }
};

// Optional: Middleware to verify user role (if needed)
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // First, verify the token
    // Assuming user role is stored/fetched after token verification
    // This requires fetching user details based on req.userId
    // For simplicity now, let's assume role is part of the token (NOT RECOMMENDED for critical roles)
    // Or that you fetch the user based on req.userId earlier
    // if (req.user && req.user.role === 'admin') {
    //    next();
    // } else {
    //    return res.status(403).json({ error: "Forbidden: Admin access required." });
    // }
    // Placeholder: Implement role check based on your auth flow
    console.warn(
      "verifyAdmin middleware needs implementation based on role retrieval"
    );
    next(); // Temporarily allow
  });
};
