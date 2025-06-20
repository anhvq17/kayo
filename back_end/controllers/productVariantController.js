import ProductVariantModel from "../models/ProductVariantModel";
import { productVariantSchema } from "../validations/productVariant";


export const getAllVariant = async (req, res) => {
  try {
    const variants = await ProductVariantModel.find().populate('productId', 'name');
    return res.status(200).json({
      message: 'All Variants',
      data: variants
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const getVariantDetail = async (req, res) => {
  try {
    const variant = await ProductVariantModel.findById(req.params.id).populate('productId', 'name');
    if (!variant) {
      return res.status(404).json({ message: 'Not Found' });
    }
    return res.status(200).json({
      message: 'Detail Variant',
      data: variant
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const deleteVariant = async (req, res) => {
  try {
    const variant = await ProductVariantModel.findByIdAndDelete(req.params.id);
    if (!variant) {
      return res.status(404).json({ message: 'Not Found' });
    }
    return res.status(200).json({
      message: 'Delete Variant',
      data: variant
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const updateVariant = async (req, res) => {
  try {
    // 1. Validate đầu vào
    const { error } = productVariantSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // 2. Kiểm tra trùng lặp (loại trừ chính nó ra khỏi check)
    const isExist = await ProductVariantModel.findOne({
      _id: { $ne: req.params.id }, // Loại trừ biến thể đang chỉnh sửa
      productId: req.body.productId,
      volume: req.body.volume,
      flavors: req.body.flavors
    });

    if (isExist) {
      return res.status(409).json({
        message: `Mùi hương ${req.body.flavors} và dung tích ${req.body.volume}ml cho sản phẩm này đã tồn tại.`
      });
    }

    // 3. Cập nhật
    const variant = await ProductVariantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!variant) {
      return res.status(404).json({ message: 'Không tìm thấy biến thể để cập nhật.' });
    }

    return res.status(200).json({
      message: 'Cập nhật biến thể thành công.',
      data: variant
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


export const createVariant = async (req, res) => {
  try {
    const { error } = productVariantSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // 2. Kiểm tra xem biến thể đã tồn tại chưa (theo productId + volume)
    const isExist = await ProductVariantModel.findOne({
      productId: req.body.productId,
      volume: req.body.volume,
      flavors: req.body.flavors
    });

    if (isExist) {
      return res.status(400).json({
        message: `Mùi hương ${req.body.flavors} và dung tích ${req.body.volume}ml cho sản phẩm này đã tồn tại.`
      });
    }

    const variant = await ProductVariantModel.create(req.body);
    const populated = await ProductVariantModel.findById(variant._id).populate('productId', 'name');

    return res.status(200).json({
      message: 'Create Variant',
      data: populated
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// lấy toàn bộ biến thể lên updateAdd commentMore actions
export const getVariantsByProductId = async (req, res) => {
  try {
    const variants = await ProductVariantModel.find({ productId: req.params.productId });
    return res.status(200).json({
      message: 'Variants by Product ID',
      data: variants
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
