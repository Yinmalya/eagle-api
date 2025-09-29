import express from "express";
import {
  getAllArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { isContributorOrAdmin } from "../middleware/authzMiddleware.js";
import { imageUpload } from "../middleware/UploadMiddleware.js";
import commentsRouter from "./comments.route.js";

const router = express.Router();

/**
 * @route   GET /api/articles
 * @desc    Get all articles with optional search/filter/pagination
 * @access  Public
 * Query params: ?search=term&page=1&limit=10
 */
router.get("/", getAllArticles);

/**
 * @route   POST /api/articles
 * @desc    Create a new article (supports up to 5 images)
 * @access  Private (Admin or Contributor)
 */
router.post(
  "/",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5),
  createArticle
);

/**
 * @route   GET /api/articles/:id
 * @desc    Get single article by ID
 * @access  Public
 */
router.get("/:id", getArticle);

/**
 * @route   PUT /api/articles/:id
 * @desc    Update an article (text, videoUrl, optional images)
 * @access  Private (Admin or Contributor)
 */
router.put(
  "/:id",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5), // allow updating images too
  updateArticle
);

/**
 * @route   DELETE /api/articles/:id
 * @desc    Delete an article
 * @access  Private (Admin or Contributor)
 */
router.delete("/:id", protect, isContributorOrAdmin, deleteArticle);

/**
 * Nested comments routes: /api/articles/:articleId/comments
 */
router.use("/:articleId/comments", commentsRouter);

export default router;
