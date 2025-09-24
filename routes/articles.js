import express from 'express';
import { 
    createArticle, 
    getArticles, 
    getArticleById, 
    updateArticle, 
    deleteArticle 
} from '../controllers/articles.controller.js';

const router = express.Router();

// Define API routes for articles
router.post('/', createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;
