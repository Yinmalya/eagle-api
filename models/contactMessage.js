import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "reviewed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
