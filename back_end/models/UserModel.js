import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  avatar: { type: String, default: "" },
address: { type: String, default: "" },

  isActive: { type: Boolean, default: true }, // ✅ thêm dòng này
}, { timestamps: true });

// Hàm kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // fix: thêm return
  this.password = await bcrypt.hash(this.password, 10);
  next(); // fix: gọi next() sau khi hash
});

export default mongoose.model('User', userSchema);
