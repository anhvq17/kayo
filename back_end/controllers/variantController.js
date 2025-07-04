import VariantModel from "../models/VariantModel.js";
import { variantSchema } from "../validations/variant.js";

// Lấy tất cả variants chưa bị xóa mềm
export const getAllVariants = async (req, res) => {
  try {
    const variants = await VariantModel.find({ deletedAt: null })
      .populate("productId", "name")
      .populate("attributes.attributeId", "name")
      .populate("attributes.valueId", "value")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All Variants",
      data: variants,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách biến thể:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


export const getVariantDetail = async (req, res) => {
  try {
    const variant = await VariantModel.findById(req.params.id)
      .populate("productId")
      .populate("attributes.attributeId")
      .populate("attributes.valueId");
    if (!variant) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      message: "Detail Variant",
      data: variant,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// lấy tất cả các biến thể trong sản phẩm 
export const getVariantsByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const variants = await VariantModel.find({
      productId,
      deletedAt: null, // lọc biến thể chưa bị xóa mềm nếu có
    })
      .populate("productId")
      .populate("attributes.attributeId")
      .populate("attributes.valueId");

    return res.status(200).json({
      message: "Variants by Product ID",
      data: variants,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createVariant = async (req, res) => {
  try {
    const { error } = variantSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const variant = await VariantModel.create(req.body);
    return res.status(200).json({
      message: "Create Variant",
      data: variant,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { error } = variantSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const variant = await VariantModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!variant) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Update Variant",
      data: variant,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm một biến thể
export const softDeleteVariant = async (req, res) => {
  try {
    const variant = await VariantModel.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });

    if (!variant) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ message: "Soft Deleted Variant" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục một biến thể đã xóa mềm
export const restoreVariant = async (req, res) => {
  try {
    const variant = await VariantModel.findByIdAndUpdate(req.params.id, {
      deletedAt: null,
    });

    if (!variant) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ message: "Restored Variant" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa cứng một biến thể
export const hardDeleteVariant = async (req, res) => {
  try {
    const variant = await VariantModel.findByIdAndDelete(req.params.id);
    if (!variant) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Hard Deleted Variant",
      data: variant,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Lấy tất cả các biến thể đã bị xóa mềm
export const getTrashedVariants = async (req, res) => {
  try {
    const trashedVariants = await VariantModel.find({ deletedAt: { $ne: null } })
      .populate("productId")
      .populate("attributes.attributeId")
      .populate("attributes.valueId");

    return res.status(200).json({
      message: "Danh sách biến thể trong thùng rác",
      data: trashedVariants,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục nhiều biến thể có trong thùng rác
export const restoreManyVariants = async (req, res) => {
  try {
    const { ids } = req.body; // array of IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await VariantModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: null }
    );

    return res.status(200).json({
      message: "Khôi phục thành công các biến thể",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Xóa vĩnh viễn nhiều biến thể có trong thùng rác
export const hardDeleteManyVariants = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await VariantModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Xóa vĩnh viễn các biến thể thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Xóa mềm nhiều biến thể
export const softDeleteManyVariants = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await VariantModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      message: "Đã chuyển các biến thể vào thùng rác",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};