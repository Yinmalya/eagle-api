import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async ({ to, subject, text }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email creds not set; skipping sendEmail");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

export default sendEmail;
