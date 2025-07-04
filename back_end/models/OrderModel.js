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
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },

  paymentMethod: {
    type: String,
    enum: ['cod', 'vnpay'],
    default: 'cod',
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipping', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('orders', orderSchema);
