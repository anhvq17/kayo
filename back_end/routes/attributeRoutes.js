import { Router } from "express";
import {
  createAttribute,
  getAllAttributes,
  getAttributeDetail,
  updateAttribute,
  softDeleteAttribute,
  hardDeleteAttribute,
  restoreAttribute
} from "../controllers/attributeController.js";

const attributeRouter = Router();

attributeRouter.get("/", getAllAttributes);
attributeRouter.get("/:id", getAttributeDetail);
attributeRouter.post("/", createAttribute);
attributeRouter.put("/:id", updateAttribute);
attributeRouter.delete("/:id", softDeleteAttribute); // xóa mềm: cập nhật deletedAt
attributeRouter.delete("/hard/:id", hardDeleteAttribute); // xóa cứng
attributeRouter.patch("/restore/:id", restoreAttribute); // khôi phục: đặt deletedAt = null

export default attributeRouter;
