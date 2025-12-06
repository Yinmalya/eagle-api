import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import articlesRoutes from "./routes/articles.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import usersRoutes from "./routes/users.routes.js";
import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// optional: serve uploads directory if you use local storage
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articlesRoutes);
// nested comment routes are mounted inside articles.routes (using /:articleId/comments)
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => res.send("Welcome to Eagle API"));

// central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
