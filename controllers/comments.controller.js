/**
 * COMMENTS CONTROLLER
 *
 * Summary of updateComment & deleteComment Authorization:
 *  - Author check: Logged-in user must match comment.author.
 *  - Anonymous check: If comment.author is null, the request body must include
 *    an `email` that matches comment.email.
 *  - Privileged override: A logged-in user with role 'admin' or 'contributor'
 *    can update/delete any comment.
 */

import asyncHandler from "express-async-handler";
import Comment from "../models/comment.js";
import Article from "../models/Article.js";
import User from "../models/User.js";

// @desc    Create a new comment
// @route   POST /api/articles/:articleId/comments
// @access  Public (Email required for all, login optional)
const createComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content, username, email } = req.body;

  if (!content || !email) {
    return res
      .status(400)
      .json({ message: "Comment content and email are required." });
  }

  const article = await Article.findById(articleId);
  if (!article) {
    return res.status(404).json({ message: "Article not found." });
  }

  let authorId = null;
  let finalUsername = username;

  if (req.user) {
    authorId = req.user.id || req.user._id;
    const user = await User.findById(authorId);
    finalUsername = user ? user.username : "Authenticated User";
  } else if (!finalUsername) {
    finalUsername = "Anonymous Reader";
  }

  const newComment = new Comment({
    content,
    author: authorId,
    username: finalUsername,
    email,
    article: articleId,
  });

  const createdComment = await newComment.save();

  article.comments.push(createdComment._id);
  await article.save();

  res.status(201).json(createdComment);
});

// @desc    Get all comments for an article
// @route   GET /api/articles/:articleId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const comments = await Comment.find({ article: articleId }).sort({
    createdAt: -1,
  });
  res.status(200).json(comments);
});

// @desc    Update a comment
// @route   PATCH /api/articles/:articleId/comments/:id
// @access  Private (Author, matching anonymous email, or admin/contributor)
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, email } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: "Comment not found." });

  const user = req.user; // provided by protect middleware
  const isAuthor =
    user &&
    comment.author &&
    comment.author.toString() === (user.id || user._id).toString();
  const isAnonOwner = !comment.author && email && email === comment.email;
  const isPrivileged = user && ["admin", "contributor"].includes(user.role);

  if (!isAuthor && !isAnonOwner && !isPrivileged) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this comment." });
  }

  comment.content = content || comment.content;
  const updatedComment = await comment.save();
  res.status(200).json(updatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/articles/:articleId/comments/:id
// @access  Private (Author, matching anonymous email, or admin/contributor)
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: "Comment not found." });

  const user = req.user;
  const isAuthor =
    user &&
    comment.author &&
    comment.author.toString() === (user.id || user._id).toString();
  const isAnonOwner = !comment.author && email && email === comment.email;
  const isPrivileged = user && ["admin", "contributor"].includes(user.role);

  if (!isAuthor && !isAnonOwner && !isPrivileged) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this comment." });
  }

  await Article.updateOne(
    { _id: comment.article },
    { $pull: { comments: comment._id } }
  );
  await Comment.deleteOne({ _id: id });

  res.status(200).json({ message: "Comment deleted successfully." });
});

export { createComment, getComments, updateComment, deleteComment };
