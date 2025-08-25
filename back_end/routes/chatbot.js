// backend/routes/chatbot.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js'; // ⚡ Import model đơn hàng

const router = express.Router();

// Lấy API key từ biến môi trường
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// System prompt
const systemInstruction = `Bạn là một trợ lý hỗ trợ khách hàng thân thiện và chuyên nghiệp cho một cửa hàng nước hoa trực tuyến.
Mục tiêu của bạn là giúp khách hàng tìm được loại nước hoa hoàn hảo.
- Luôn giao tiếp bằng Tiếng Việt, trừ khi người dùng nhắn bằng ngôn ngữ khác.
- Giọng văn của bạn phải thân thiện, nhiệt tình, chuyên nghiệp và dễ hiểu.
- Luôn xưng là "em" và gọi khách hàng là "anh/chị".
- Chức năng chính của bạn bao gồm:
  1. Giới thiệu sản phẩm: Cung cấp chi tiết về mùi hương (các tầng hương, độ lưu hương, độ toả hương), thương hiệu, dung tích và giá cả.
  2. Đưa ra gợi ý: Đặt câu hỏi để làm rõ sở thích của khách hàng (dịp sử dụng, mùa, loại mùi hương mong muốn) để đề xuất 2-3 sản phẩm phù hợp.
  3. Hỗ trợ đặt hàng: Hướng dẫn người dùng cách thêm sản phẩm vào giỏ hàng. Đối với thông tin thanh toán và vận chuyển, hãy hướng họ đến trang chính thức hoặc liên hệ nhân viên hỗ trợ.
  4. Trả lời FAQ: Giải đáp các thắc mắc về đổi trả, vận chuyển, phí ship, bảo quản nước hoa.
- Nếu được hỏi ngoài chủ đề, hãy từ chối lịch sự và hướng lại chủ đề nước hoa.
- Giữ câu trả lời ngắn gọn, hữu ích.`;

// Route streaming
router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;
    console.log(req.body)
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Tin nhắn không hợp lệ' });
    }

    // ⚡ Query dữ liệu thật từ DB khi người dùng hỏi
    let productContext = '';

    // Sản phẩm bán chạy
    if (message.includes('bán chạy') || message.includes('top')) {
      const products = await Product.find().sort({ sold: -1 }).limit(5);
      productContext = "Danh sách 5 sản phẩm bán chạy nhất hiện tại:\n" +
        products.map((p, i) => {
          const price = typeof p.price === "number" ? p.price.toLocaleString() : "Liên hệ";
          return `${i + 1}. ${p.name} - ${price}đ`;
        }).join("\n");
    }

    // Sản phẩm mới nhất
    if (message.includes('mới nhất')) {
      const products = await Product.find().sort({ createdAt: -1 }).limit(5);
      productContext = "5 sản phẩm mới nhất trong cửa hàng:\n" +
        products.map((p, i) => {
          const price = typeof p.price === "number" ? p.price.toLocaleString() : "Liên hệ";
          return `${i + 1}. ${p.name} - ${price}đ`;
        }).join("\n");
    }

    // Sản phẩm giá rẻ
    if (message.includes('giá rẻ')) {
      const products = await Product.find().sort({ price: 1 }).limit(5);
      productContext = "5 sản phẩm giá rẻ nhất hiện tại:\n" +
        products.map((p, i) => {
          const price = typeof p.price === "number" ? p.price.toLocaleString() : "Liên hệ";
          return `${i + 1}. ${p.name} - ${price}đ`;
        }).join("\n");
    }

    // ⚡ Đơn hàng gần nhất
    if (message.includes('đơn hàng gần nhất') || message.includes('đơn cuối')) {
      if (userId) {
        const latestOrder = await Order.findOne({ userId })
          .sort({ createdAt: -1 })
          .populate("items.product");

        if (latestOrder) {
          productContext = `Đơn hàng gần nhất của anh/chị:
Mã đơn: ${latestOrder._id}
Ngày đặt: ${latestOrder.createdAt.toLocaleString()}
Tổng tiền: ${typeof latestOrder.totalPrice === "number" ? latestOrder.totalPrice.toLocaleString() : "Liên hệ"}đ
Trạng thái: ${latestOrder.status}
Sản phẩm:
${latestOrder.items.map((it, i) =>
            `${i + 1}. ${it.product?.name || "Sản phẩm"} x${it.quantity} - ${(it.price || 0).toLocaleString()}đ`
          ).join("\n")}`;
        } else {
          productContext = "Anh/chị chưa có đơn hàng nào.";
        }
      } else {
        productContext = "Anh/chị cần đăng nhập để kiểm tra đơn hàng gần nhất nhé.";
      }
    }

    // Lấy model Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    // Gửi message + dữ liệu thật (nếu có)
    const result = await model.generateContentStream(
      productContext
        ? `${message}\n\nThông tin dữ liệu thật của cửa hàng:\n${productContext}`
        : message
    );

    // Thiết lập header cho streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();
  } catch (error) {
    console.error('Lỗi gọi Google Generative AI:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Lỗi chatbot' });
    } else {
      res.end('\n\n[Hệ thống] Đã xảy ra lỗi, vui lòng thử lại sau.');
    }
  }
});

export default router;
