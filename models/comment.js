import mongoose, { Schema } from "mongoose";

// Define the Comment Schema
const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article", // Reference to the Article model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Comment model
export default mongoose.model("Comment", CommentSchema);
