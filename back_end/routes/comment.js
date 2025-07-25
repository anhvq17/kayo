import { Router } from "express";
import {
  createComment,
  getCommentsByProduct,
  getCommentById,
  deleteComment
} from "../controllers/commentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

// Tạo bình luận mới
router.post("/", protect ,  upload.array('image', 3) , createComment);

// Lấy tất cả bình luận theo sản phẩm
router.get("/product/:productId", getCommentsByProduct);

// Lấy chi tiết một bình luận theo ID
router.get("/:id", getCommentById);

// Xóa bình luận theo ID
router.delete("/:id", deleteComment);

export default router;
