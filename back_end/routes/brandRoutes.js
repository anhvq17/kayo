import { Router } from "express";
import {
  createBrand,
  getAllBrands,
  getBrandDetail,
  updateBrand,
  softDeleteBrand,
  hardDeleteBrand,
  restoreBrand,
  getTrashedBrands,
  restoreManyBrands,
  softDeleteManyBrands,
  hardDeleteManyBrands
} from "../controllers/brandController.js";

const brandRouter = Router();

// Thùng rác & khôi phục
brandRouter.get("/trash", getTrashedBrands); // Lấy danh sách thương hiệu đã xóa mềm
brandRouter.delete("/soft-delete-many", softDeleteManyBrands); // Xóa mềm nhiều thương hiệu
brandRouter.delete("/hard-delete-many", hardDeleteManyBrands); // Xóa cứng nhiều thương hiệu
brandRouter.patch("/restore-many", restoreManyBrands); // Khôi phục nhiều thương hiệu
brandRouter.delete("/hard/:id", hardDeleteBrand); // Xóa cứng một thương hiệu
brandRouter.patch("/restore/:id", restoreBrand); // Khôi phục một thương hiệu
brandRouter.delete("/soft/:id", softDeleteBrand); // Xóa mềm một thương hiệu

// CRUD chính
brandRouter.get("/", getAllBrands); // Lấy tất cả thương hiệu chưa bị xóa
brandRouter.get("/:id", getBrandDetail); // Lấy chi tiết một thương hiệu
brandRouter.post("/", createBrand); // Tạo mới thương hiệu
brandRouter.put("/:id", updateBrand); // Cập nhật thương hiệu

export default brandRouter;
