import { Router } from "express";
import {
  createVariant,
  getAllVariants,
  getVariantDetail,
  updateVariant,
  softDeleteVariant,
  hardDeleteVariant,
  restoreVariant,
  getTrashedVariants,
  restoreManyVariants,
  hardDeleteManyVariants,
  softDeleteManyVariants,
  getVariantsByProductId
} from "../controllers/variantController.js";

const variantRouter = Router();


variantRouter.get("/trash", getTrashedVariants); // lấy danh sách đã bị xóa mềm
variantRouter.delete("/soft-delete-many", softDeleteManyVariants); // Xóa mềm nhiều biến thể 
variantRouter.delete("/hard-delete-many", hardDeleteManyVariants); // Xóa cứng nhiều biến thể có trong thùng rác
variantRouter.patch("/restore-many", restoreManyVariants); // Khôi phục nhiều biến thể trong thùng rác
variantRouter.delete("/hard/:id", hardDeleteVariant); // Xóa cứng biến thể
variantRouter.patch("/restore/:id", restoreVariant); // Khôi phục một biến thể trong thùng rác
variantRouter.delete("/soft/:id", softDeleteVariant); // Xóa mềm một biến thể
variantRouter.get("/", getAllVariants); // Lấy tất cả các biến thể
variantRouter.get("/product/:productId", getVariantsByProductId); // lấy tất cả các biến thể trong sản phẩm (chi tiết và update)
variantRouter.get("/:id", getVariantDetail);
variantRouter.post("/", createVariant);
variantRouter.put("/:id", updateVariant);




export default variantRouter;
