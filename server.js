import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path"; // <-- Import path to resolve directories

import authRoutes from "./routes/auth.route.js";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/comments.route.js";
import newsletterRoutes from "./routes/newsletter.js";
import userProfileRoutes from "./routes/userRoutes.js";

dotenv.config();
console.log("Cloudinary ENV vars:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve uploaded files statically so images are accessible publicly
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/articles", commentRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/users", userProfileRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Eagle API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
