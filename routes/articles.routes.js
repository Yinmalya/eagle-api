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
import { imageUpload, videoUpload } from "../middleware/upload.js";
import commentsRouter from "./comments.routes.js";

const router = express.Router();

// public
router.get("/", getAllArticles);
router.get("/:id", getArticle);

// protected create/update/delete (contributors & admins)
router.post(
  "/",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5),
  createArticle
);

router.put(
  "/:id",
  protect,
  isContributorOrAdmin,
  imageUpload.array("images", 5),
  updateArticle
);

router.delete("/:id", protect, isContributorOrAdmin, deleteArticle);

// mount comments router for /api/articles/:articleId/comments
router.use("/:articleId/comments", commentsRouter);

export default router;
