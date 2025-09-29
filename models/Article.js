import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  // NEW: Article category
  category: {
    type: String,
    enum: ["sports", "entertainment", "politics", "business", "tech", "other"],
    required: true,
    trim: true,
  },
  imageUrls: {
    type: [String],
    default: [],
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Article = mongoose.model("Article", ArticleSchema);
export default Article;
