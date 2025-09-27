import express from 'express';
import asyncHandler from 'express-async-handler';
import Article from '../models/Article.js';
import User from '../models/User.js';
import { imageUpload, videoUpload } from '../middleware/uploadMiddleware.js'; // updated multer for Cloudinary

const router = express.Router();

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const articles = await Article.find({}).populate('comments');
    res.status(200).json(articles);
}));

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (article) {
        await article.populate({
            path: 'comments',
            select: 'content author createdAt',
            populate: { path: 'author', select: 'username' }
        });
        res.status(200).json(article);
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
}));

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private (Admin or Contributor)
// Accepts multiple images + optional single video upload
router.post(
    '/',
    imageUpload.array('images', 5),   // upload max 5 images
    videoUpload.single('video'),      // optional single video
    asyncHandler(async (req, res) => {
        const { title, content } = req.body;

        if (!title || !content) {
            // Optionally, here you could delete uploaded files on Cloudinary to clean up, but that's extra logic
            return res.status(400).json({ message: 'Please include a title and content for the article.' });
        }

        const user = await User.findById(req.user.id);

        // Collect image URLs from Cloudinary
        const imageUrls = req.files && req.files.length > 0
            ? req.files.map(file => file.path)
            : [];

        // Get video URL if uploaded
        const videoUrl = req.file ? req.file.path : null;

        const newArticle = new Article({
            title,
            content,
            author: user.username,
            imageUrls: imageUrls.length > 0 ? imageUrls : ['placeholder_url'],
            videoUrl: videoUrl || undefined,
        });

        const createdArticle = await newArticle.save();
        res.status(201).json(createdArticle);
    })
);

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private (Admin or Contributor)
router.put(
    '/:id',
    imageUpload.array('images', 5),
    videoUpload.single('video'),
    asyncHandler(async (req, res) => {
        const { title, content } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.title = title || article.title;
        article.content = content || article.content;

        // Update images if new ones uploaded
        if (req.files && req.files.length > 0) {
            article.imageUrls = req.files.map(file => file.path);
        }

        // Update video if new video uploaded
        if (req.file) {
            article.videoUrl = req.file.path;
        }

        const updatedArticle = await article.save();
        res.status(200).json(updatedArticle);
    })
);

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private (Admin or Contributor)
router.delete('/:id', asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (article) {
        await Article.deleteOne({ _id: article._id });
        res.status(200).json({ message: 'Article removed' });
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
}));

export default router;
