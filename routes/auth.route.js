import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/register
// Route for user registration
router.post("/register", registerUser);

// POST /api/auth/login
// Route for user login
router.post("/login", loginUser);

// POST /api/auth/forgot-password
// Route to send password reset link to email
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password/:token
// Route to reset password using the token
router.post("/reset-password/:token", resetPassword);

export default router;
