import Comment from "../models/Comment.js";
import Article from "../models/Article.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

// @desc    Create a new comment
// @route   POST /api/articles/:articleId/comments
// @access  Public (Readers do not need to log in)
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { articleId } = req.params;

  if (!content) {
    res.status(400);
    throw new Error("Comment content is required");
  }

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    res.status(400);
    throw new Error("Invalid article ID");
  }

  const article = await Article.findById(articleId);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  // Since users don't need to log in, we'll assign a placeholder or anonymous ID.
  // NOTE: For now, we'll use a placeholder/dummy author ID until we implement
  // a way for anonymous users to be tracked, or we can use the req.user.id if protect is added later.
  // Since we removed 'protect', we must ensure req.user.id is not accessed.
  // For this demonstration, we'll temporarily use the article author ID as a fallback,
  // but in a real app, this should be handled by a unique session ID for anonymous users.
  const authorId = req.user ? req.user.id : article.author;

  // Create the comment
  const comment = new Comment({
    content,
    author: authorId,
    article: articleId,
  });

  const createdComment = await comment.save();

  // Link the comment to the article
  article.comments.push(createdComment._id);
  await article.save();

  res.status(201).json({
    message: "Comment created successfully",
    comment: createdComment,
  });
});

// @desc    Get all comments for a specific article
// @route   GET /api/articles/:articleId/comments
// @access  Public
const getCommentsForArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    res.status(400);
    throw new Error("Invalid article ID");
  }

  const comments = await Comment.find({ article: articleId })
    .sort({ createdAt: -1 })
    .select("-__v"); // Exclude the version key

  if (!comments) {
    res.status(404);
    throw new Error("No comments found for this article");
  }

  res.status(200).json(comments);
});

// @desc    Update a comment
// @route   PUT /api/articles/:articleId/comments/:id
// @access  Private/Admin (Will be updated to be Admin or original author later)
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // The comment ID
  const { content } = req.body;

  const comment = await Comment.findById(id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Basic authorization check: Only the comment author can update it (for now)
  if (comment.author.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this comment");
  }

  comment.content = content || comment.content;
  const updatedComment = await comment.save();

  res.json({
    message: "Comment updated successfully",
    comment: updatedComment,
  });
});

// @desc    Delete a comment
// @route   DELETE /api/articles/:articleId/comments/:id
// @access  Private/Admin (Will be updated to be Admin only, or Admin/Author)
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // The comment ID

  const comment = await Comment.findById(id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Current authorization check (to be updated for Admin):
  // Only the comment author can delete it.
  if (comment.author.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  await comment.deleteOne();

  res.json({ message: "Comment deleted successfully" });
});

// Export all functions for use in the router
export { createComment, getCommentsForArticle, updateComment, deleteComment };


