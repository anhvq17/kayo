// routes/wallet.js
import express from "express";
import { getWallet, addToWallet, withdrawFromWallet } from "../controllers/walletController.js";
import { protect } from "../middlewares/authMiddleware.js"; // middleware bảo vệ route

const router = express.Router();

router.get("/", protect, getWallet); // Lấy số dư
router.post("/add", protect, addToWallet); // Nạp tiền
router.post("/withdraw", protect, withdrawFromWallet); // Rút tiền

export default router;
