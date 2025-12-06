import express from "express";
import { protect } from "../middleware/auth.js";
import { getMyProfile, updateMyProfile } from "../controllers/userProfile.controller.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);

export default router;
