import { Router } from "express";
import { createComment, getCommentsByProduct, deleteComment } from "../controllers/commentController.js";

const router = Router();

router.post("/", createComment); // Thêm bình luận
router.get("/:productId", getCommentsByProduct); // Lấy tất cả bình luận theo sản phẩm
router.delete("/:id", deleteComment); // Xóa bình luận theo ID

export default router;
