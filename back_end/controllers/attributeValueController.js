import AttributeValueModel from "../models/AttributeValueModel.js";
import VariantModel from "../models/VariantModel.js"
import { attributeValueSchema } from "../validations/attributeValue.js";

// Lấy tất cả attribute values chưa bị xóa mềm
export const getAllAttributeValues = async (req, res) => {
  try {
    const values = await AttributeValueModel.find({ deletedAt: null })
      .populate("attributeId")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All Attribute Values",
      data: values,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAttributeValueDetail = async (req, res) => {
  try {
    const value = await AttributeValueModel.findById(req.params.id).populate("attributeId");
    if (!value) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      message: "Detail Attribute Value",
      data: value,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createAttributeValue = async (req, res) => {
  try {
    const { error } = attributeValueSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { value, valueCode, attributeId } = req.body;

    // Check trùng value trong cùng attributeId
    const existingValue = await AttributeValueModel.findOne({
      value: value.trim(),
      attributeId,
      deletedAt: null,
    });

    if (existingValue) {
      return res.status(400).json({
        message: "Validation failed",
        errors: ["Giá trị đã tồn tại trong thuộc tính này"],
      });
    }

    // Check trùng valueCode trong cùng attributeId
    const existingCode = await AttributeValueModel.findOne({
      valueCode: valueCode.trim(),
      attributeId,
      deletedAt: null,
    });

    if (existingCode) {
      return res.status(400).json({
        message: "Validation failed",
        errors: ["Mã giá trị đã tồn tại trong thuộc tính này"],
      });
    }

    const valueCreated = await AttributeValueModel.create({
      value: value.trim(),
      valueCode: valueCode.trim(),
      attributeId,
    });

    return res.status(200).json({
      message: "Create Attribute Value",
      data: valueCreated,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateAttributeValue = async (req, res) => {
  try {
    const { error } = attributeValueSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const value = await AttributeValueModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!value) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Update Attribute Value",
      data: value,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// XÓA MỀM
export const softDeleteAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;

    //  Kiểm tra xem giá trị có đang dùng trong variant nào không
    const isUsed = await VariantModel.exists({
      "attributes.valueId": id,
      deletedAt: null,
    });

    if (isUsed) {
      return res
        .status(400)
        .json({ message: "Giá trị này đang được sử dụng trong sản phẩm." });
    }

    const value = await AttributeValueModel.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });

    if (!value) {
      return res.status(404).json({ message: "Không tìm thấy giá trị thuộc tính." });
    }

    return res.status(200).json({ message: "Đã chuyển vào thùng rác." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// KHÔI PHỤC
export const restoreAttributeValue = async (req, res) => {
  try {
    const value = await AttributeValueModel.findByIdAndUpdate(req.params.id, {
      deletedAt: null,
    });

    if (!value) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ message: "Restored Attribute Value" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// XÓA CỨNG
export const hardDeleteAttributeValue = async (req, res) => {
  try {
    const value = await AttributeValueModel.findByIdAndDelete(req.params.id);
    if (!value) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Hard Deleted Attribute Value",
      data: value,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả attribute values đã bị xóa mềm
export const getTrashedAttributeValues = async (req, res) => {
  try {
    const values = await AttributeValueModel.find({ deletedAt: { $ne: null } }).populate("attributeId");
    return res.status(200).json({
      message: "Danh sách attribute values trong thùng rác",
      data: values,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm nhiều attribute values
export const softDeleteManyAttributeValues = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeValueModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      message: "Đã chuyển attribute values vào thùng rác",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục nhiều attribute values đã bị xóa mềm
export const restoreManyAttributeValues = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeValueModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: null }
    );

    return res.status(200).json({
      message: "Khôi phục thành công các attribute values",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa cứng nhiều attribute values
export const hardDeleteManyAttributeValues = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeValueModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Xóa vĩnh viễn các attribute values thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
