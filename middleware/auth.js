import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "Not authorized" });
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
