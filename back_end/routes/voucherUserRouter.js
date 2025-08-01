import { Router } from "express";
import { saveVoucher, applyVoucher, getUserVouchers, removeSavedVoucher, removeExpiredVouchers  } from "../controllers/voucherUserController.js";

const voucherUserRouter = Router();

voucherUserRouter.post("/save", saveVoucher); //  Lưu mã về tài khoản user
voucherUserRouter.post("/apply", applyVoucher);          //  Dùng mã khi thanh toán
voucherUserRouter.get("/saved/:userId", getUserVouchers);  // Hiển thị voucher của user đó
voucherUserRouter.delete("/remove", removeSavedVoucher);  // tự xóa voucher hết hạn khỏi user
voucherUserRouter.delete("/remove-expired/:userId", removeExpiredVouchers);  // tự động xóa voucher hết hạn

export default voucherUserRouter;
