import asyncHandler from "express-async-handler";
import Article from "../models/Article.js";
import User from "../models/User.js";

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getAllArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({}).populate("comments");
  res.status(200).json(articles);
});

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    await article.populate({
      path: "comments",
      select: "content author createdAt",
      populate: { path: "author", select: "username" },
    });

    res.status(200).json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private (Admin or Contributor)
const createArticle = asyncHandler(async (req, res) => {
  // Extract title, content, and the text-based videoUrl from req.body
  const { title, content, videoUrl } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Please include a title and content for the article.",
    });
  }

  // Get the user object using the ID from the token payload (req.user.id)
  const user = await User.findById(req.user.id || req.user._id);

  if (!user) {
    return res.status(401).json({ message: "User not found or token invalid." });
  }

  // Map the array of file objects to get the Cloudinary path (URL)
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    // .path contains the secure Cloudinary URL after a successful upload
    imageUrls = req.files.map((file) => file.path); 
  }

  const newArticle = new Article({
    title,
    content,
    author: user.username,
    imageUrls: imageUrls, 
    videoUrl: videoUrl || undefined, 
  });

  const createdArticle = await newArticle.save();
  res.status(201).json(createdArticle);
});

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private (Admin or Contributor)
const updateArticle = asyncHandler(async (req, res) => {
  // Destructure all possible fields, including the text-based videoUrl
  const { title, content, videoUrl } = req.body;
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  article.title = title || article.title;
  article.content = content || article.content;
   
  // Update the text-based video URL if provided in the body
  if (videoUrl !== undefined) {
    article.videoUrl = videoUrl;
  }

  // Update images if new files uploaded
  if (req.files && req.files.length > 0) {
    article.imageUrls = req.files.map((file) => file.path);
  }

  const updatedArticle = await article.save();
  res.status(200).json(updatedArticle);
});

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private (Admin or Contributor)
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
