import { Router } from "express";
import {
  createAttributeValue,
  getAllAttributeValues,
  getAttributeValueDetail,
  updateAttributeValue,
  softDeleteAttributeValue,
  hardDeleteAttributeValue,
  restoreAttributeValue
} from "../controllers/attributeValueController.js";

const attributeValueRouter = Router();

attributeValueRouter.get("/", getAllAttributeValues);
attributeValueRouter.get("/:id", getAttributeValueDetail);
attributeValueRouter.post("/", createAttributeValue);
attributeValueRouter.put("/:id", updateAttributeValue);
attributeValueRouter.delete("/:id", softDeleteAttributeValue); // Xóa mềm
attributeValueRouter.delete("/hard/:id", hardDeleteAttributeValue); // Xóa cứng
attributeValueRouter.patch("/restore/:id", restoreAttributeValue); // Khôi phục (đặt deletedAt = null)

export default attributeValueRouter;
