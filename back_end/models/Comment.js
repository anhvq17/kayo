import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  image: {
      type: [String], // ✅ CHỖ NÀY: phải là mảng string
      default: [],
    }, // thêm trường ảnh
    hidden: {
    type: Boolean,
    default: false, // ✅ Mặc định hiển thị
  },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
