import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    fullAddress: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    detail: { type: String },
  },
    paymentStatus: { 
    type: String, 
    enum: ['Đã thanh toán', 'Chưa thanh toán', 'Đã hoàn tiền'],
    default: 'Chưa thanh toán' 
  },

  paymentMethod: {
  type: String,
  enum: ['cod', 'vnpay', 'wallet'],
  default: 'cod',
},
  // Tham chiếu giao dịch của cổng thanh toán (ví dụ: VNPay vnp_TxnRef)
  paymentTransactionRef: { type: String, unique: true, sparse: true },
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
  voucherCode: { type: String },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percent', 'fixed'], default: undefined },
  discountValue: { type: Number, default: undefined },
  cancelReason: { type: String },
  returnReason: { type: String },
  // Lưu các sản phẩm/biến thể và số lượng yêu cầu hoàn hàng
  returnItems: [
    {
      orderItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'order_items' },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'product_variants' },
      quantity: { type: Number, min: 1 },
    },
  ],
  // Ảnh minh chứng hoàn hàng (cấp đơn)
  returnImages: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('orders', orderSchema);