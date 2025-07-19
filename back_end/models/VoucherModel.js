import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
  code: {   // Mã giảm giá
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },

  description: {  // Mô tả
    type: String,
    default: '',
  },

  discountType: {  // Kiểu giảm giá
    type: String,
    required: true,
    enum: ['percent', 'fixed'],
  },

  discountValue: {  // Giá trị giảm
    type: Number,
    required: true,
  },

  minOrderValue: {  // Đơn hàng tối thiểu
    type: Number,
    default: 0,
  },

  maxDiscountValue: {   // Giảm tiền tối đa
    type: Number,
    default: null,
  },

  startDate: {  // Ngày bắt đầu
    type: Date,
    default: null,
  },

  endDate: {   // Ngày kết thúc
    type: Date,
    default: null,
  },

  usageLimit: {  // Tổng số lần dùng
    type: Number,
    default: null,
  },

  usedCount: {   // Đã dùng bao nhiêu lần
    type: Number,
    default: 0,
  },

  status: {  // Trạng thái
    type: String,
    enum: ["activated", "inactivated"],
    default: "activated",
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

VoucherSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('vouchers', VoucherSchema);
