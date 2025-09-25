import express from 'express';
import {
  registerUser,
  loginUser,
} from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/auth/register
// Route for user registration
router.post('/register', registerUser);

// POST /api/auth/login
// Route for user login
router.post('/login', loginUser);

export default router;
