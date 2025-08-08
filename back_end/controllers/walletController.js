// controller/walletController.js
import User from "../models/UserModel.js";

// Lấy số dư ví
export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("wallet");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cộng tiền vào ví
export const addToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.wallet += amount;
    await user.save();

    res.json({ message: "Nạp tiền thành công", wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trừ tiền từ ví
export const withdrawFromWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (user.wallet < amount) {
      return res.status(400).json({ message: "Số dư không đủ" });
    }

    user.wallet -= amount;
    await user.save();

    res.json({ message: "Rút tiền thành công", wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
