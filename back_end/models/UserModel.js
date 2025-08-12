import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const walletHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['add', 'withdraw', 'refund'],
    required: true
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
  date: { type: Date, default: Date.now },
  note: { type: String } // ✅ Thêm ghi chú
});



const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  avatar: { type: String, default: "" },
  address: { type: String, default: "" },
  isActive: { type: Boolean, default: true },

  wallet: { type: Number, default: 0 },
  walletHistory: { type: [walletHistorySchema], default: [] },  // Thêm trường này

}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', userSchema);
