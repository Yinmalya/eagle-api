import { Router } from 'express';
import { 
    getCommentsForArticle, 
    createComment, 
    deleteComment // We are going to use this new function
} from '../controllers/comments.controller.js';
import { protect } from '../middleware/authMiddleware.js'; 
// NOTE: We will update the DELETE route later with isAdmin middleware, 
// but for now, we use 'protect' to make sure the server starts.

const router = Router({ mergeParams: true });

// GET /api/articles/:articleId/comments - Public route to get all comments
router.get('/', getCommentsForArticle);

// POST /api/articles/:articleId/comments - Public route for readers to leave comments
// We removed 'protect' here to align with your requirement that readers don't need to log in to comment.
router.post('/', createComment); 

// DELETE /api/articles/:articleId/comments/:id - Protected route to delete a comment
router.delete('/:id', protect, deleteComment);

export default router;
