import Comment from "../models/Comment.js";
import Product from "../models/ProductModel.js";

export const createComment = async (req, res) => {
  try {
    const { productId, userId, content, rating } = req.body;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

    const newComment = new Comment({ productId, userId, content, rating });
    await newComment.save();

    res.status(201).json({ message: "Đã thêm bình luận.", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm bình luận.", error });
  }
};

export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ productId }).populate("userId", "username");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bình luận.", error });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy bình luận." });

    res.status(200).json({ message: "Xoá bình luận thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá bình luận.", error });
  }
};
