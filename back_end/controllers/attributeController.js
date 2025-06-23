import AttributeModel from "../models/AttributeModel.js";
import { attributeSchema } from "../validations/attribute.js";

// Lấy danh sách attributes chưa bị xóa mềm
export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await AttributeModel.find({ deletedAt: null });
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
