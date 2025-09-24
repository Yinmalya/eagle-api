import Comment from '../models/comment.js';
import Article from '../models/Article.js';

// @desc    Create a new comment
// @route   POST /api/articles/:articleId/comments
// @access  Private
export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { articleId } = req.params;

        // Ensure the user is authenticated (from the auth middleware)
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Find the article to ensure it exists
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Create the new comment
        const newComment = new Comment({
            content,
            author: req.user._id,
            article: articleId
        });

        const comment = await newComment.save();

        // Add the new comment's ID to the article's comments array
        article.comments.push(comment._id);
        await article.save();

        res.status(201).json({
            message: 'Comment created successfully',
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all comments for a specific article
// @route   GET /api/articles/:articleId/comments
// @access  Public
export const getCommentsForArticle = async (req, res) => {
    try {
        const { articleId } = req.params;

        // Find the article and populate its comments
        const article = await Article.findById(articleId)
            .populate({
                path: 'comments',
                select: 'content author createdAt',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ comments: article.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
