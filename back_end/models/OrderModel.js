import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    fullAddress: { type: String }, // Địa chỉ đầy đủ từ user
    province: { type: String }, // Tỉnh/Thành phố
    district: { type: String }, // Quận/Huyện
    ward: { type: String }, // Phường/Xã
    detail: { type: String }, // Địa chỉ chi tiết
  },
    paymentStatus: { 
    type: String, 
    enum: ['Đã thanh toán', 'Chưa thanh toán', 'Đã hoàn tiền'],
    default: 'Chưa thanh toán' 
  },

  paymentMethod: {
    type: String,
    enum: ['cod', 'vnpay'],
    default: 'cod',
  },
  orderStatus: {
    type: String,
    enum: [
      'Chờ xử lý',
      'Đã xử lý',
      'Đang giao hàng',
      'Đã giao hàng',
      'Đã nhận hàng',
      'Đã huỷ đơn hàng',
      'Yêu cầu hoàn hàng',
      'Đã hoàn hàng',
      'Từ chối hoàn hàng'
    ],
    default: 'Chờ xử lý',
  },
  totalAmount: { type: Number, required: true },
  originalAmount: { type: Number, required: true },
  voucherCode: { type: String }, // Mã giảm giá đã áp dụng
  discount: { type: Number, default: 0 }, // Số tiền giảm giá
  discountType: { type: String, enum: ['percent', 'fixed'], default: undefined }, // Loại giảm giá
  discountValue: { type: Number, default: undefined }, // Giá trị giảm giá
  cancelReason: { type: String }, // Lý do hủy đơn hàng
  returnReason: { type: String }, // Lý do hoàn hàng
}, { timestamps: true });

export default mongoose.model('orders', orderSchema);
