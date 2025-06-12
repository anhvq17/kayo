import { Router } from "express";
import {
  createComment,
  getCommentsByProduct,
  getCommentById,
  deleteComment
} from "../controllers/commentController.js";

const router = Router();

router.post("/", createComment);                         // Tạo bình luận
router.get("/product/:productId", getCommentsByProduct); // Lấy bình luận theo sản phẩm
router.get("/:id", getCommentById);                      // Xem chi tiết một bình luận
router.delete("/:id", deleteComment);                    // Xóa bình luận theo ID

export default router;
