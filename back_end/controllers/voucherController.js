import VoucherModel from "../models/VoucherModel.js";
import { voucherSchema } from "../validations/voucher.js";

// Lấy tất cả voucher chưa bị xóa mềm
export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await VoucherModel.find({ deletedAt: null }).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Danh sách voucher", data: vouchers });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Lấy chi tiết một voucher
export const getVoucherDetail = async (req, res) => {
  try {
    const voucher = await VoucherModel.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher." });
    return res.status(200).json({ message: "Chi tiết voucher", data: voucher });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Tạo mới voucher
export const createVoucher = async (req, res) => {
  try {
    const { error } = voucherSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation thất bại", errors });
    }

    const { code } = req.body;
    const exists = await VoucherModel.findOne({ code: code.trim().toUpperCase(), deletedAt: null });
    if (exists) {
      return res.status(400).json({ message: "Mã voucher đã tồn tại", errors: ["Mã voucher đã tồn tại"] });
    }

    const newVoucher = await VoucherModel.create(req.body);
    return res.status(200).json({ message: "Tạo voucher thành công", data: newVoucher });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Cập nhật voucher
export const updateVoucher = async (req, res) => {
  try {
    const { error } = voucherSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation thất bại", errors });
    }

    const voucher = await VoucherModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher." });

    return res.status(200).json({ message: "Cập nhật voucher thành công", data: voucher });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm voucher
export const softDeleteVoucher = async (req, res) => {
  try {
    const voucher = await VoucherModel.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher." });
    return res.status(200).json({ message: "Đã chuyển voucher vào thùng rác." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục voucher
export const restoreVoucher = async (req, res) => {
  try {
    const voucher = await VoucherModel.findByIdAndUpdate(req.params.id, { deletedAt: null });
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher." });
    return res.status(200).json({ message: "Khôi phục voucher thành công" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa cứng voucher
export const hardDeleteVoucher = async (req, res) => {
  try {
    const voucher = await VoucherModel.findByIdAndDelete(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher." });
    return res.status(200).json({ message: "Đã xóa vĩnh viễn voucher", data: voucher });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách voucher trong thùng rác
export const getTrashedVouchers = async (req, res) => {
  try {
    const trashed = await VoucherModel.find({ deletedAt: { $ne: null } });
    return res.status(200).json({ message: "Danh sách voucher trong thùng rác", data: trashed });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục nhiều voucher
export const restoreManyVouchers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await VoucherModel.updateMany({ _id: { $in: ids } }, { deletedAt: null });
    return res.status(200).json({ message: "Khôi phục nhiều voucher thành công", data: result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa vĩnh viễn nhiều voucher
export const hardDeleteManyVouchers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await VoucherModel.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ message: "Xóa vĩnh viễn nhiều voucher thành công", data: result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm nhiều voucher
export const softDeleteManyVouchers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await VoucherModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      message: "Xóa mềm nhiều voucher thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

