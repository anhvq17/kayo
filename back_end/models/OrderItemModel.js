import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'product_variants', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  isReviewed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('order_items', orderItemSchema);

