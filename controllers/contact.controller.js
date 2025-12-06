import asyncHandler from "express-async-handler";
import ContactMessage from "../models/contactMessage.js";
import sendEmail from "../utils/sendEmail.js";

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields required" });

  const newMessage = new ContactMessage({ name, email, message });
  await newMessage.save();

  // send to admin if credentials provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  }

  res.status(201).json({ success: true, message: "Message saved" });
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

export const getMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) return res.status(404).json({ error: "Message not found" });
  res.json(message);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ error: "Message not found" });
  res.json({ success: true, message: "Message deleted" });
});
