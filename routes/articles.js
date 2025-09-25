import express from 'express';
import {
  getArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articles.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import commentsRouter from './comments.route.js';

const router = express.Router();

// Get all articles
router.get('/', getArticles);

// Create a new article
router.post('/', protect, createArticle);

// Get a single article
router.get('/:id', getArticle);

// Update an article
router.patch('/:id', protect, updateArticle);

// Delete an article
router.delete('/:id', protect, deleteArticle);

// Nested comments router
router.use('/:articleId/comments', commentsRouter);

export default router;
