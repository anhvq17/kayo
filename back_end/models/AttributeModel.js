import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema({
    name: { // VD: Dung tích
        type: String, 
        required: true 
    }, 
    attributeCode: { // VD: volume
        type: String, 
        required: true, 
        unique: true 
    }, 
    description: { 
        type: String 
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
        default: Date.now },
});

// Cập nhật tự động updatedAt trước khi lưu
AttributeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("attributes", AttributeSchema);
