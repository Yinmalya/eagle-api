import asyncHandler from "express-async-handler";
import Comment from "../models/comment.js";
import Article from "../models/Article.js";
import User from "../models/user.js";

// POST /api/articles/:articleId/comments
const createComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content, username, email } = req.body;

  if (!content || !email) return res.status(400).json({ message: "Content and email required" });

  const article = await Article.findById(articleId);
  if (!article) return res.status(404).json({ message: "Article not found" });

  let authorId = null;
  let finalUsername = username;

  if (req.user) {
    authorId = req.user.id || req.user._id;
    const user = await User.findById(authorId);
    finalUsername = user ? user.username : "Authenticated User";
  } else if (!finalUsername) {
    finalUsername = "Anonymous Reader";
  }

  const comment = new Comment({
    content,
    author: authorId,
    username: finalUsername,
    email,
    article: articleId,
  });

  const created = await comment.save();
  article.comments.push(created._id);
  await article.save();

  res.status(201).json(created);
});

// GET /api/articles/:articleId/comments
const getComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const comments = await Comment.find({ article: articleId }).sort({ createdAt: -1 }).populate("author", "username");
  res.status(200).json(comments);
});

// PATCH /api/articles/:articleId/comments/:id
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, email } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: "Comment not found." });

  const user = req.user;
  const isAuthor = user && comment.author && comment.author.toString() === (user.id || user._id).toString();
  const isAnonOwner = !comment.author && email && email === comment.email;
  const isPrivileged = user && ["admin", "contributor"].includes(user.role);

  if (!isAuthor && !isAnonOwner && !isPrivileged) return res.status(403).json({ message: "Not authorized" });

  comment.content = content || comment.content;
  const updated = await comment.save();
  res.status(200).json(updated);
});

// DELETE /api/articles/:articleId/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: "Comment not found." });

  const user = req.user;
  const isAuthor = user && comment.author && comment.author.toString() === (user.id || user._id).toString();
  const isAnonOwner = !comment.author && email && email === comment.email;
  const isPrivileged = user && ["admin", "contributor"].includes(user.role);

  if (!isAuthor && !isAnonOwner && !isPrivileged) return res.status(403).json({ message: "Not authorized" });

  await Article.updateOne({ _id: comment.article }, { $pull: { comments: comment._id } });
  await Comment.deleteOne({ _id: id });

  res.status(200).json({ message: "Comment deleted successfully." });
});

export { createComment, getComments, updateComment, deleteComment };
