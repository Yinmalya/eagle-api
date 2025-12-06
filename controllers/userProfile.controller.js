import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updated = await user.save();
  res.json({ id: updated._id, username: updated.username, email: updated.email, role: updated.role });
});
