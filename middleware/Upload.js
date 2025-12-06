import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eagle-api/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});

export const imageUpload = multer({ storage: imageStorage, limits: { fileSize: 5 * 1024 * 1024 } });

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eagle-api/videos",
    allowed_formats: ["mp4", "mov", "webm"],
    resource_type: "video",
  },
});

export const videoUpload = multer({ storage: videoStorage, limits: { fileSize: 50 * 1024 * 1024 } });

export default imageUpload;
