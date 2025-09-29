import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userProfileController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);

export default router;
