import express from "express";
import {
  submitContact,
  getMessages,
  getMessageById,
  deleteMessage,
} from "../controllers/contact.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", submitContact);

// admin only
router.get("/", protect, authorize("admin"), getMessages);
router.get("/:id", protect, authorize("admin"), getMessageById);
router.delete("/:id", protect, authorize("admin"), deleteMessage);

export default router;
