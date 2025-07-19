import { Router } from "express";
import {
  createVoucher,
  getAllVouchers,
  getVoucherDetail,
  updateVoucher,
  softDeleteVoucher,
  hardDeleteVoucher,
  restoreVoucher,
  getTrashedVouchers,
  restoreManyVouchers,
  softDeleteManyVouchers,
  hardDeleteManyVouchers
} from "../controllers/voucherController.js";

const voucherRouter = Router();

voucherRouter.get("/trash", getTrashedVouchers); // lấy danh sách voucher đã xóa mềm
voucherRouter.delete("/soft-delete-many", softDeleteManyVouchers); // xóa mềm nhiều voucher
voucherRouter.delete("/hard-delete-many", hardDeleteManyVouchers); // xóa cứng nhiều voucher
voucherRouter.patch("/restore-many", restoreManyVouchers); // khôi phục nhiều voucher
voucherRouter.delete("/hard/:id", hardDeleteVoucher); // xóa cứng một voucher
voucherRouter.patch("/restore/:id", restoreVoucher); // khôi phục một voucher
voucherRouter.delete("/soft/:id", softDeleteVoucher); // xóa mềm một voucher
voucherRouter.get("/", getAllVouchers); // lấy tất cả voucher chưa bị xóa
voucherRouter.get("/:id", getVoucherDetail); // lấy chi tiết một voucher
voucherRouter.post("/", createVoucher); // tạo mới voucher
voucherRouter.put("/:id", updateVoucher); // cập nhật voucher

export default voucherRouter;
