import { Router } from "express";
import {
  createAttribute,
  getAllAttributes,
  getAttributeDetail,
  updateAttribute,
  softDeleteAttribute,
  hardDeleteAttribute,
  restoreAttribute,
  getTrashedAttributes,
  restoreManyAttributes,
  // softDeleteManyAttributes,
  hardDeleteManyAttributes
} from "../controllers/attributeController.js";

const attributeRouter = Router();

attributeRouter.get("/trash", getTrashedAttributes); // lấy danh sách thuộc tính đã xóa mềm
// attributeRouter.delete("/soft-delete-many", softDeleteManyAttributes); // xóa mềm nhiều thuộc tính
attributeRouter.delete("/hard-delete-many", hardDeleteManyAttributes); // xóa cứng nhiều thuộc tính
attributeRouter.patch("/restore-many", restoreManyAttributes); // khôi phục nhiều thuộc tính
attributeRouter.delete("/hard/:id", hardDeleteAttribute); // xóa cứng một thuộc tính
attributeRouter.patch("/restore/:id", restoreAttribute); // khôi phục một thuộc tính
attributeRouter.delete("/soft/:id", softDeleteAttribute); // xóa mềm một thuộc tính
attributeRouter.get("/", getAllAttributes); // lấy tất cả thuộc tính chưa bị xóa
attributeRouter.get("/:id", getAttributeDetail); // lấy chi tiết thuộc tính
attributeRouter.post("/", createAttribute); // tạo mới
attributeRouter.put("/:id", updateAttribute); // cập nhật

export default attributeRouter;
