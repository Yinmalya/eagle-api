import express from "express";
import {
  createComment,
  getComments, // This name must match the export in the controller
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// POST /api/articles/:articleId/comments - Public access for creation
router.post("/", createComment);

// GET /api/articles/:articleId/comments - Public access to view comments
router.get("/", getComments);

// PATCH and DELETE routes require a logged-in user (Author Only)
router
  .route("/:id")
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

export default router;
