import mongoose from "mongoose";

const AttributeValueSchema = new mongoose.Schema({
  value: { // VD: "100ml", "Hoa nhài"
    type: String,
    required: true
  },
  valueCode: { // VD: "100ml"
    type: String,
    required: true,
    unique: true
  },
  attributeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attributes", // Liên kết với bảng attributes
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Cập nhật tự động updatedAt trước khi lưu
AttributeValueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("attribute_values", AttributeValueSchema);
