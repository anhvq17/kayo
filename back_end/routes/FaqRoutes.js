import express from "express";
import { addFaq, getFaqs, getFaqById, updateFaq, deleteFaq } from "../controllers/FaqController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route thêm câu hỏi: chỉ admin
router.post("/", protect, authorize("admin"), addFaq);

// Route lấy tất cả FAQ: client có thể truy cập
router.get("/", getFaqs);
router.get("/:id", getFaqById); // lấy chi tiết FAQ
router.put("/:id", protect, authorize("admin"), updateFaq); // cập nhật FAQ
router.delete("/:id", protect, authorize("admin"), deleteFaq); // xóa FAQ

export default router;
