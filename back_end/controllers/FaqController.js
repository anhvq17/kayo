import FaqModel from "../models/FaqModel.js";

// Lấy danh sách FAQ
export const addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Câu hỏi và câu trả lời không được để trống" });
    }

    const existing = await FaqModel.findOne({ question });
    if (existing) {
      return res.status(400).json({ message: "Câu hỏi đã tồn tại" });
    }

    const faq = new FaqModel({ question, answer });
    await faq.save();

    res.status(201).json({ message: "Thêm câu hỏi thành công", faq });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const faqs = await FaqModel.find().sort({ createdAt: -1 });
    res.json({ faqs });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
export const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FaqModel.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "Không tìm thấy FAQ" });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật FAQ theo id
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Câu hỏi và câu trả lời không được để trống" });
    }

    const faq = await FaqModel.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "Không tìm thấy FAQ" });
    }

    // Có thể kiểm tra trùng câu hỏi nếu cần (tuỳ logic)
    faq.question = question;
    faq.answer = answer;
    await faq.save();

    res.json({ message: "Cập nhật FAQ thành công", faq });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FaqModel.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "Không tìm thấy FAQ" });
    }
    await faq.deleteOne();
    res.json({ message: "Xóa FAQ thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};