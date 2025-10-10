import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes by ensuring a valid JWT is present
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (split "Bearer <token>" and take the second part)
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token payload (excluding the password field for security)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      // 4. Attach the user object (including role) to the request for access in controllers
      req.user = user;

      next(); // Move to the next middleware or controller
    } catch (error) {
      // Handle expired or invalid tokens
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  // If no token is provided in the header
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// Middleware to restrict access based on user role(s)
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role (attached by the 'protect' middleware)
    // is included in the authorized roles array passed to the middleware
    if (!roles.includes(req.user.role)) {
      // 403 Forbidden error
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
