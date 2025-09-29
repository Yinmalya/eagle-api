import express from 'express';
import {
  getAllArticles, // Changed alias from getArticles to getAllArticles
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articles.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { isContributorOrAdmin } from '../middleware/authzMiddleware.js'; // Import authorization
import { imageUpload } from '../middleware/UploadMiddleware.js'; // Import image upload middleware
import commentsRouter from './comments.route.js';

const router = express.Router();

// Get all articles
router.get('/', getAllArticles); // Updated function call

// Create a new article
// Use imageUpload.array() to handle up to 5 images on the 'images' field
router.post(
  '/', 
  protect, 
  isContributorOrAdmin, // ADDED: Authorization check
  imageUpload.array('images', 5), // ADDED: Multer middleware for file upload
  createArticle
);

// Get a single article
router.get('/:id', getArticle);

// Update an article
router.patch('/:id', protect, isContributorOrAdmin, updateArticle); // ADDED: Authorization check

// Delete an article
router.delete('/:id', protect, isContributorOrAdmin, deleteArticle); // ADDED: Authorization check

// Nested comments router
router.use('/:articleId/comments', commentsRouter);

export default router;
