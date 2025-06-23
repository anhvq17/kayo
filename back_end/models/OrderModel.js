import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('orders', orderSchema);
