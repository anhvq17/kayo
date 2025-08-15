import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Có giá trị" : "❌ Không có giá trị");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTestEmail = async () => {
  try {
    await transporter.sendMail({
      from: `"Test Mailer" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test email",
      text: "Xin chào, đây là email test!",
    });
    console.log("✅ Email test gửi thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi gửi mail:", error);
  }
};

sendTestEmail();