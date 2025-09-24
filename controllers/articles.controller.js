import Article from '../models/Article.js';

// Controller functions for articles
export const createArticle = async (req, res) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.status(200).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
