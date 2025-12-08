import express from "express";
import {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.controller.js";
import { protect } from "../middleware/auth.js";
import { isContributorOrAdmin } from "../middleware/role.js";
import { imageUpload } from "../middleware/upload.js";
import commentsRouter from "./comments.routes.js";

const router = express.Router();

// -------- PUBLIC ROUTES --------
router.get("/", getAllArticles);
router.get("/:id", getArticle);

// -------- PROTECTED ROUTES (contributors & admins) --------

// CREATE ARTICLE
router.post(
  "/",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5),
  createArticle
);

// FULL UPDATE (PUT)
router.put(
  "/:id",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5),
  updateArticle
);

// PARTIAL UPDATE (PATCH)
router.patch(
  "/:id",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5),
  updateArticle
);

// DELETE ARTICLE
router.delete("/:id", protect, isContributorOrAdmin, deleteArticle);

// -------- COMMENTS ROUTES --------
router.use("/:articleId/comments", commentsRouter);

export default router;
