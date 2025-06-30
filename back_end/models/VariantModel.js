import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products", // Liên kết với bảng products
    required: true,
  },
  attributes: [
    {
      attributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "attributes", // Liên kết với bảng attributes
        required: true,
      },
      valueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "attribute_values", // Liên kết với bảng attributes_value
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Cập nhật tự động updatedAt trước khi lưu
VariantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("product_variants", VariantSchema);
