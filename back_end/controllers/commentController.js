import Comment from "../models/Comment.js";
import Product from "../models/ProductModel.js";

// Thêm bình luận
export const createComment = async (req, res) => {
  try {
    const { productId, userId, content, rating } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    const newComment = new Comment({ productId, userId, content, rating });
    await newComment.save();

    return res.status(201).json({
      message: "Đã thêm bình luận.",
      comment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thêm bình luận.",
      error: error.message,
    });
  }
};

// Lấy tất cả bình luận theo sản phẩm
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ productId })
      .populate("userId", "username")
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy bình luận.",
      error: error.message,
    });
  }
};

// Lấy chi tiết một bình luận theo ID
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("userId", "username");

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy chi tiết bình luận.",
      error: error.message,
    });
  }
};

// Xoá bình luận
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    return res.status(200).json({ message: "Xoá bình luận thành công." });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xoá bình luận.",
      error: error.message,
    });
  }
};
