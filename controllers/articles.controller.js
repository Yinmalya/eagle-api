import asyncHandler from "express-async-handler";
import Article from "../models/Article.js";
import User from "../models/User.js";

/**
 * @desc    Get all articles (search, author filter & pagination)
 * @route   GET /api/articles
 * @access  Public
 *
 * Query Parameters:
 *   ?search=keyword        -> text search in title OR content
 *   ?author=username       -> filter by author username
 *   ?page=1&limit=10       -> pagination
 */
const getAllArticles = asyncHandler(async (req, res) => {
  const { search, author, page = 1, limit = 10 } = req.query;

  // ----- NEW: dynamic MongoDB query -----
  const query = {};
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ title: regex }, { content: regex }];
  }
  if (author) {
    query.author = { $regex: author, $options: "i" };
  }

  const pageNum = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNum - 1) * pageSize;

  const total = await Article.countDocuments(query);
  const articles = await Article.find(query)
    .populate("comments")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);

  res.status(200).json({
    total,
    page: pageNum,
    pages: Math.ceil(total / pageSize),
    results: articles.length,
    articles,
  });
});

/**
 * @desc    Get a single article
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  await article.populate({
    path: "comments",
    select: "content author createdAt",
    populate: { path: "author", select: "username" },
  });

  res.status(200).json(article);
});

/**
 * @desc    Create a new article
 * @route   POST /api/articles
 * @access  Private (Admin or Contributor)
 */
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, videoUrl } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Please include a title and content for the article." });
  }

  const user = await User.findById(req.user.id || req.user._id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "User not found or token invalid." });
  }

  const imageUrls = req.files?.length ? req.files.map((f) => f.path) : [];

  const newArticle = new Article({
    title,
    content,
    author: user.username,
    imageUrls,
    videoUrl: videoUrl || undefined,
  });

  const createdArticle = await newArticle.save();
  res.status(201).json(createdArticle);
});

/**
 * @desc    Update an article
 * @route   PUT /api/articles/:id
 * @access  Private (Admin or Contributor)
 */
const updateArticle = asyncHandler(async (req, res) => {
  const { title, content, videoUrl } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  article.title = title || article.title;
  article.content = content || article.content;
  if (videoUrl !== undefined) article.videoUrl = videoUrl;
  if (req.files?.length) article.imageUrls = req.files.map((f) => f.path);

  const updatedArticle = await article.save();
  res.status(200).json(updatedArticle);
});

/**
 * @desc    Delete an article
 * @route   DELETE /api/articles/:id
 * @access  Private (Admin or Contributor)
 */
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  await Article.deleteOne({ _id: article._id });
  res.status(200).json({ message: "Article removed" });
});

export {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
