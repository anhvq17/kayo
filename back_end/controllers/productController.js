import VariantModel from "../models/VariantModel.js";
import ProductModel from "../models/ProductModel.js";
import { productSchema } from "../validations/product.js";

// Lấy tất cả sản phẩm chưa bị xóa mềm
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({ deletedAt: null })
      .populate("categoryId")
      .populate("brandId")
      .sort({ createdAt: -1 }) // Mới nhất lên đầu
    return res.status(200).json({
      message: "All Products",
      data: products,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const getProductDetail = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id)
      .populate("categoryId")
      .populate("brandId")

    if (!product) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Detail Product",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const product = await ProductModel.create(req.body);

    return res.status(200).json({
      message: "Create Product",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Update Product",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm một sản phẩm
export const softDeleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });

    if (!product) {
      return res.status(404).json({ message: "Not Found" });
    }

    // Soft delete tất cả biến thể của sản phẩm
    await VariantModel.updateMany(
      { productId: req.params.id },
      { deletedAt: new Date() }
    );

    return res.status(200).json({ message: "Soft Deleted Product và các biến thể" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục một sản phẩm đã xóa mềm
export const restoreProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, {
      deletedAt: null,
    });

    if (!product) {
      return res.status(404).json({ message: "Not Found" });
    }

    // Restore tất cả biến thể của sản phẩm
    await VariantModel.updateMany(
      { productId: req.params.id },
      { deletedAt: null }
    );

    return res.status(200).json({ message: "Restored Product và các biến thể" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Xóa cứng một sản phẩm
export const hardDeleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not Found" });
    }

    // Hard delete tất cả biến thể thuộc sản phẩm
    await VariantModel.deleteMany({ productId: req.params.id });

    return res.status(200).json({
      message: "Hard Deleted Product và các biến thể",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Lấy tất cả sản phẩm đã bị xóa mềm
export const getTrashedProducts = async (req, res) => {
  try {
    const trashedProducts = await ProductModel.find({ deletedAt: { $ne: null } })
      .populate("categoryId")
      .populate("brandId");

    return res.status(200).json({
      message: "Danh sách sản phẩm trong thùng rác",
      data: trashedProducts,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục nhiều sản phẩm đã bị xóa mềm
export const restoreManyProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    // 1. Khôi phục sản phẩm
    const result = await ProductModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: null }
    );

    // 2. Khôi phục biến thể thuộc các sản phẩm đó
    await VariantModel.updateMany(
      { productId: { $in: ids } },
      { deletedAt: null }
    );

    return res.status(200).json({
      message: "Khôi phục thành công các sản phẩm và biến thể",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Xóa cứng nhiều sản phẩm đã bị xóa mềm
export const hardDeleteManyProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    // 1. Xóa vĩnh viễn sản phẩm
    const result = await ProductModel.deleteMany({ _id: { $in: ids } });

    // 2. Xóa vĩnh viễn biến thể của các sản phẩm đó
    await VariantModel.deleteMany({ productId: { $in: ids } });

    return res.status(200).json({
      message: "Xóa vĩnh viễn các sản phẩm và biến thể thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Xóa mềm nhiều sản phẩm
export const softDeleteManyProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    // 1. Cập nhật deletedAt cho danh sách sản phẩm
    const result = await ProductModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date() }
    );

    // 2. Cập nhật deletedAt cho tất cả biến thể của các sản phẩm đó
    await VariantModel.updateMany(
      { productId: { $in: ids } },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      message: "Đã chuyển các sản phẩm và biến thể vào thùng rác",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
