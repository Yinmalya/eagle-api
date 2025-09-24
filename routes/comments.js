    import { Router } from 'express';
    import { getCommentsForArticle, createComment } from '../controllers/comments.controller.js';
    import { protect } from '../middleware/authMiddleware.js';

    const router = Router({ mergeParams: true });

    // Route to get all comments for a specific article
    router.get('/', getCommentsForArticle);

    // Route to create a new comment on a specific article
    router.post('/', protect, createComment);

    export default router;