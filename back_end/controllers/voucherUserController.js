import VoucherModel from "../models/VoucherModel.js";
import VoucherUserModel from "../models/VoucherUserModel.js";

// Lưu mã về tài khoản user
export const saveVoucher = async (req, res) => {
    const { userId, voucherCode } = req.body;

    try {
        const voucher = await VoucherModel.findOne({
            code: voucherCode.toUpperCase(),
            status: "activated",
        });

        if (!voucher) {
            return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
        }

        const now = new Date();
        if (
            (voucher.startDate && now < voucher.startDate) ||
            (voucher.endDate && now > voucher.endDate)
        ) {
            return res
                .status(400)
                .json({ message: "Mã giảm giá đã hết hạn hoặc chưa được áp dụng." });
        }

        if (
            voucher.usageLimit !== null &&
            voucher.usedCount >= voucher.usageLimit
        ) {
            return res
                .status(400)
                .json({ message: "Mã giảm giá đã hết lượt sử dụng." });
        }

        const alreadySaved = await VoucherUserModel.findOne({
            userId,
            voucherId: voucher._id,
        });

        if (alreadySaved) {
            return res.status(400).json({ message: "Bạn đã lưu mã này rồi." });
        }

        // Lưu mã cho user
        await VoucherUserModel.create({
            userId,
            voucherId: voucher._id,
        });

        // Tăng usedCount lên 1
        await VoucherModel.findByIdAndUpdate(voucher._id, {
            $inc: { usedCount: 1 },
        });

        return res.status(200).json({ message: "Lưu mã thành công" });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Dùng mã khi thanh toán
export const applyVoucher = async (req, res) => {
    const { userId, voucherCode } = req.body;

    try {
        const voucher = await VoucherModel.findOne({
            code: voucherCode.toUpperCase(),
            status: "activated",
        });

        if (!voucher) {
            return res
                .status(404)
                .json({ message: "Mã giảm giá không tồn tại hoặc không hoạt động." });
        }

        const now = new Date();
        if (
            (voucher.startDate && now < voucher.startDate) ||
            (voucher.endDate && now > voucher.endDate)
        ) {
            return res
                .status(400)
                .json({ message: "Mã giảm giá đã hết hạn hoặc chưa được áp dụng." });
        }

        if (
            voucher.usageLimit !== null &&
            voucher.usedCount >= voucher.usageLimit
        ) {
            return res
                .status(400)
                .json({ message: "Mã giảm giá đã hết lượt sử dụng." });
        }

        const alreadyUsed = await VoucherUserModel.findOne({
            userId,
            voucherId: voucher._id,
        });

        if (alreadyUsed) {
            return res
                .status(400)
                .json({ message: "Bạn đã sử dụng mã giảm giá này." });
        }

        // Đánh dấu là đã dùng (đã lưu trước đó là đủ điều kiện dùng)
        await VoucherUserModel.create({
            userId,
            voucherId: voucher._id,
        });

        // Tăng lượt dùng
        await VoucherModel.findByIdAndUpdate(voucher._id, {
            $inc: { usedCount: 1 },
        });

        return res.status(200).json({
            message: "Áp dụng mã thành công",
            discount: voucher.discountValue,
        });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Trang "Voucher của tôi"
export const getUserVouchers = async (req, res) => {
    try {
        const { userId } = req.params;

        const vouchers = await VoucherUserModel.find({ userId })
            .populate("voucherId")
            .lean();

        const result = vouchers.map((vu) => {
            const v = vu.voucherId;
            return {
                _id: v._id,
                code: v.code,
                discountType: v.discountType,
                discountValue: v.discountValue,
                startDate: v.startDate,
                endDate: v.endDate,
                status: v.status,
            };
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Xóa voucher khỏi tài khoản (khi hết hạn)
export const removeSavedVoucher = async (req, res) => {
    const { userId, voucherId } = req.body;

    try {
        await VoucherUserModel.deleteOne({ userId, voucherId });
        res.status(200).json({ message: "Đã xóa voucher khỏi tài khoản" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
