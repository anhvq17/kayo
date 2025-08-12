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

// Lấy lịch sử giao dịch ví
export const getWalletHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletHistory");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    
    // Sắp xếp walletHistory theo date giảm dần
    const sortedHistory = (user.walletHistory || []).sort((a, b) => b.date - a.date);

    res.json({ history: sortedHistory });
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

    // Thêm lịch sử nạp tiền
    user.walletHistory.push({
      type: "add",
      amount,
      date: new Date(),
      status: "completed"
    });

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

    // Thêm lịch sử rút tiền
   user.walletHistory.push({
      type: "withdraw",
      amount,
      date: new Date(),
      status: "completed"
    });

    await user.save();

    res.json({ message: "Rút tiền thành công", wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Hoàn tiền vào ví (refund)
export const refundToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.wallet += amount;

    const refundEntry = {
      type: "refund",
      amount,
      date: new Date(),
      status: "completed"
    };

    user.walletHistory.push(refundEntry);

    console.log("Thêm refund vào walletHistory:", refundEntry);

    await user.save();

    res.json({ message: "Hoàn tiền thành công", wallet: user.wallet });
  } catch (error) {
    console.error("Lỗi refundToWallet:", error);
    res.status(500).json({ message: error.message });
  }
};

