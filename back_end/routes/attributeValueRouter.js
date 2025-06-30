import { Router } from "express";
import {
  createAttributeValue,
  getAllAttributeValues,
  getAttributeValueDetail,
  updateAttributeValue,
  softDeleteAttributeValue,
  hardDeleteAttributeValue,
  restoreAttributeValue,
  getTrashedAttributeValues,
  softDeleteManyAttributeValues,
  restoreManyAttributeValues,
  hardDeleteManyAttributeValues,
} from "../controllers/attributeValueController.js";

const attributeValueRouter = Router();

attributeValueRouter.get("/trash", getTrashedAttributeValues); // Lấy danh sách attribute values đã bị xóa mềm
attributeValueRouter.delete("/soft-delete-many", softDeleteManyAttributeValues); // Xóa mềm nhiều
attributeValueRouter.delete("/hard-delete-many", hardDeleteManyAttributeValues); // Xóa cứng nhiều
attributeValueRouter.patch("/restore-many", restoreManyAttributeValues); // Khôi phục nhiều
attributeValueRouter.delete("/hard/:id", hardDeleteAttributeValue); // Xóa cứng
attributeValueRouter.patch("/restore/:id", restoreAttributeValue); // Khôi phục một
attributeValueRouter.delete("/soft/:id", softDeleteAttributeValue); // Xóa mềm một
attributeValueRouter.get("/", getAllAttributeValues); // Lấy danh sách chưa bị xóa
attributeValueRouter.get("/:id", getAttributeValueDetail);
attributeValueRouter.post("/", createAttributeValue);
attributeValueRouter.put("/:id", updateAttributeValue);

export default attributeValueRouter;
