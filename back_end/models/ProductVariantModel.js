import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  flavors: {
    type: String,
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductVariantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("product_variants", ProductVariantSchema);
