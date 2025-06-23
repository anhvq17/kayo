import AttributeValueModel from "../models/AttributeValueModel.js";
import { attributeValueSchema } from "../validations/attributeValue.js";

// Lấy tất cả attribute values chưa bị xóa mềm
export const getAllAttributeValues = async (req, res) => {
  try {
    const values = await AttributeValueModel.find({ deletedAt: null }).populate("attributeId");
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

    const value = await AttributeValueModel.create(req.body);
    return res.status(200).json({
      message: "Create Attribute Value",
      data: value,
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
    const value = await AttributeValueModel.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });

    if (!value) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ message: "Soft Deleted Attribute Value" });
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
