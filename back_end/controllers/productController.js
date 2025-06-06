import ProductModel from "../models/ProductModel"
import { productSchema } from "../validations/product";

export const getAllProducts = async (req,res) => {
    try {
        const products = await ProductModel.find()
        .populate('categoryId', 'name')  // chỉ lấy tên category
        .populate('brandId', 'name image'); // chỉ lấy tên và ảnh brand
        return res.status(200).json({
            message:'All Products',
            data:products
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        })
    }
}

export const getProductDetail = async (req,res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
         .populate('categoryId', 'name')
        .populate('brandId', 'name image');
        return res.status(200).json({
            message:'Detail Product',
            data:product
        })
    } catch (error) {
        return res.status(400).json({
            message:error.message,
        })
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id);
        if(!product) {
            return res.status(404).json({
            message:'Not Found',
        })
        }
        return res.status(200).json({
            message:'Delete Product',
            data:product
        })
    } catch (error) {
        return res.status(400).json({
            message:error.message,
        })
    }
}

export const createProduct = async (req,res) => {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false });

        if (error) {
        const errors = error.details.map(err => err.message);
        return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

        const product = await ProductModel.create(req.body);
        return res.status(200).json({
            message:'Create Product',
            data:product
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        })
    }
}

export const updateProduct = async (req,res) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if(!product) {
            return res.status(404).json({
            message:'Not Found',
        })
        }
        return res.status(200).json({
            message:'Update Product',
            data:product
        })
    } catch (error) {
        return res.status(400).json({
            message:error.message,
        })
    }
}