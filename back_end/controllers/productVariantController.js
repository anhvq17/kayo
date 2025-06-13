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
    const { error } = productVariantSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const variant = await ProductVariantModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!variant) {
      return res.status(404).json({ message: 'Not Found' });
    }

    return res.status(200).json({
      message: 'Update Variant',
      data: variant
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const createVariant = async (req, res) => {
  try {
    const { error } = productVariantSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
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
