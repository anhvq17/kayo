import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    detail: { type: String, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ['Đã thanh toán', 'Chưa thanh toán'],
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
      'Đã huỷ đơn hàng'
    ],
    default: 'Chờ xử lý',
  },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('orders', orderSchema);
