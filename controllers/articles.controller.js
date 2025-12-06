import asyncHandler from "express-async-handler";
import Article from "../models/Article.js";
import User from "../models/user.js";

// GET /api/articles
const getAllArticles = asyncHandler(async (req, res) => {
  const { search, author, category, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }];
  if (author) query.author = { $regex: author, $options: "i" };
  if (category) query.category = { $regex: category, $options: "i" };

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

// GET /api/articles/:id
const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });

  await article.populate({
    path: "comments",
    select: "content author createdAt username email",
    populate: { path: "author", select: "username" },
  });

  res.status(200).json(article);
});

// POST /api/articles
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, videoUrl, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ message: "Please include title, content and category" });
  }

  const user = await User.findById(req.user.id || req.user._id);
  if (!user) return res.status(401).json({ message: "User not found" });

  const imageUrls = req.files?.length ? req.files.map((f) => f.path) : [];

  const newArticle = new Article({
    title,
    content,
    category,
    author: user.username,
    imageUrls,
    videoUrl: videoUrl || undefined,
  });

  const created = await newArticle.save();
  res.status(201).json(created);
});

// PUT /api/articles/:id
const updateArticle = asyncHandler(async (req, res) => {
  const { title, content, videoUrl, category } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });

  article.title = title || article.title;
  article.content = content || article.content;
  if (videoUrl !== undefined) article.videoUrl = videoUrl;
  if (category !== undefined) article.category = category;
  if (req.files?.length) article.imageUrls = req.files.map((f) => f.path);

  const updated = await article.save();
  res.status(200).json(updated);
});

// DELETE /api/articles/:id
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });

  await Article.deleteOne({ _id: article._id });
  res.status(200).json({ message: "Article removed" });
});

export { getAllArticles, getArticle, createArticle, updateArticle, deleteArticle };
