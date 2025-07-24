import mongoose from "mongoose";

const VoucherUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vouchers",
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

VoucherUserSchema.index({ userId: 1, voucherId: 1 }, { unique: true });

export default mongoose.model("voucher_users", VoucherUserSchema);
