import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Lấy API key từ biến môi trường
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Tin nhắn không hợp lệ' });
    }

    // Dùng model mới
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Gọi API Google Generative AI
    const result = await model.generateContent(message);

    // Lấy text trả lời
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Lỗi gọi Google Generative AI:', error);
    res.status(500).json({ error: 'Lỗi chatbot' });
  }
});

export default router;
