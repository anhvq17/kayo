import AttributeModel from "../models/AttributeModel.js";
import { attributeSchema } from "../validations/attribute.js";

// Lấy danh sách attributes chưa bị xóa mềm
export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await AttributeModel.find({ deletedAt: null })
      .sort({ createdAt: -1 })
    return res.status(200).json({
      message: "All Attributes",
      data: attributes,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAttributeDetail = async (req, res) => {
  try {
    const attribute = await AttributeModel.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      message: "Detail Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createAttribute = async (req, res) => {
  try {
    const { error } = attributeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const attribute = await AttributeModel.create(req.body);
    return res.status(200).json({
      message: "Create Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const { error } = attributeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const attribute = await AttributeModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Update Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// SOFT DELETE
export const softDeleteAttribute = async (req, res) => {
  try {
    const attribute = await AttributeModel.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ message: "Soft Deleted Attribute" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// RESTORE
export const restoreAttribute = async (req, res) => {
  try {
    const attribute = await AttributeModel.findByIdAndUpdate(req.params.id, {
      deletedAt: null,
    });
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ message: "Restored Attribute" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// HARD DELETE
export const hardDeleteAttribute = async (req, res) => {
  try {
    const attribute = await AttributeModel.findByIdAndDelete(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      message: "Hard Deleted Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Lấy tất cả attribute đã bị xóa mềm
export const getTrashedAttributes = async (req, res) => {
  try {
    const trashedAttributes = await AttributeModel.find({ deletedAt: { $ne: null } });
    return res.status(200).json({
      message: "Danh sách thuộc tính trong thùng rác",
      data: trashedAttributes,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục nhiều attributes đã bị xóa mềm
export const restoreManyAttributes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: null }
    );

    return res.status(200).json({
      message: "Khôi phục thành công các thuộc tính",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm nhiều attributes
export const softDeleteManyAttributes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      message: "Đã chuyển các thuộc tính vào thùng rác",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa cứng nhiều attributes đã bị xóa mềm
export const hardDeleteManyAttributes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Xóa vĩnh viễn các thuộc tính thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
