import Article from '../models/Article.js';
import User from '../models/User.js';

// @desc    Create an article
// @route   POST /api/articles
// @access  Private
export const createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const newArticle = new Article({
            title,
            content,
            image: imagePath,
            author: req.user.id,
        });

        const savedArticle = await newArticle.save();
        res.status(201).json({ message: 'Article created successfully', article: savedArticle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'username');
        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single article
// @route   GET /api/articles/:id
// @access  Public
export const getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private
export const updateArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.author.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this article' });
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { title, content, image: imagePath },
            { new: true }
        );

        res.status(200).json({ message: 'Article updated successfully.', article: updatedArticle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.author.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this article' });
        }

        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Article deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
