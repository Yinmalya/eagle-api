import express from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// public
router.post("/", createComment);
router.get("/", getComments);

// protected (update/delete require auth; controller enforces permission checks)
router.patch("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
