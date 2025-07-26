
// [POST] Tạo bình luận mới
import Comment from "../models/Comment.js";
import Product from "../models/ProductModel.js";
import Joi from "joi";

// Validate dữ liệu
const commentValidationSchema = Joi.object({
  productId: Joi.string().required(),
  content: Joi.string().min(1).max(1000).required(),
  rating: Joi.number().min(1).max(5).required(),
});

// [POST] Tạo bình luận mới
export const createComment = async (req, res) => {
  try {
    const { productId, content, rating } = req.body;

    if (!productId || !content || !rating) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Xử lý nhiều ảnh (multer upload.array)
    const imagePaths = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const newComment = new Comment({
      productId,
      userId: req.user._id,
      content,
      rating,
      image: imagePaths, // lưu mảng ảnh
    });

    const savedComment = await newComment.save();
    const populated = await savedComment.populate('userId', 'name');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Lỗi tạo bình luận:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo bình luận' });
  }
};



// [GET] Lấy danh sách bình luận theo sản phẩm
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ productId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách bình luận.",
      error: error.message,
    });
  }
};

// [GET] Lấy chi tiết một bình luận
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("userId", "username");
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy chi tiết bình luận.",
      error: error.message,
    });
  }
};

// [DELETE] Xóa bình luận
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận để xoá." });
    }

    res.status(200).json({ message: "Xoá bình luận thành công." });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xoá bình luận.",
      error: error.message,
    });
  }
};
