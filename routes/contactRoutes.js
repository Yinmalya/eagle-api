
import express from "express";
import {
  submitContact,
  getMessages,
  getMessageById,
  deleteMessage,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/", submitContact);

// Admin routes
router.get("/", protect, authorize("Admin"), getMessages);
router.get("/:id", protect, authorize("Admin"), getMessageById);
router.delete("/:id", protect, authorize("Admin"), deleteMessage);

export default router;
