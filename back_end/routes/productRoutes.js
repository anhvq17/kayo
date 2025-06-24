import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductDetail,
  updateProduct,
  softDeleteProduct,
  hardDeleteProduct,
  restoreProduct,
  getTrashedProducts,
  restoreManyProducts,
  hardDeleteManyProducts,
  softDeleteManyProducts,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/trash", getTrashedProducts); // lấy danh sách sản phẩm đã xóa mềm
productRouter.delete("/soft-delete-many", softDeleteManyProducts); // Xóa mềm nhiều sản phẩm
productRouter.delete("/hard-delete-many", hardDeleteManyProducts); // xóa cứng nhiều sản phẩm
productRouter.patch("/restore-many", restoreManyProducts);     // khôi phục nhiều sản phẩm trong thùng rác
productRouter.delete("/hard/:id", hardDeleteProduct); // Xóa cứng một sản phẩm
productRouter.patch("/restore/:id", restoreProduct); // Khôi phục một sản phẩm trong thùng rác (đặt deletedAt = null)
productRouter.delete("/soft/:id", softDeleteProduct); // Xóa mềm một sản phẩm
productRouter.get("/", getAllProducts); // Lấy tất cả sản phẩm chưa bị xóa mềm
productRouter.get("/:id", getProductDetail);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
export default productRouter;
