import express from "express";
import {
  getWallet,
  addToWallet,
  withdrawFromWallet,
  getWalletHistory, 
  refundToWallet,
  // import thêm hàm mới
} from "../controllers/walletController.js";
import { protect } from "../middlewares/authMiddleware.js"; // middleware bảo vệ route

const router = express.Router();

router.get("/", protect, getWallet); // Lấy số dư
router.post("/add", protect, addToWallet); // Nạp tiền
router.post("/withdraw", protect, withdrawFromWallet); // Rút tiền

router.get("/history", protect, getWalletHistory); // Lấy lịch sử giao dịch
router.post("/refund", protect, refundToWallet);



export default router;
