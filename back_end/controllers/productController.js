import ProductModel from "../models/ProductModel"
import { productSchema } from "../validations/product";
import ProductVariantModel from "../models/ProductVariantModel";

export const getAllProducts = async (req, res) => {
  try {
    // Lấy danh sách sản phẩm kèm category và brand
    const products = await ProductModel.find()
      .populate("categoryId", "name")
      .populate("brandId", "name image")
      .lean(); // lean để kết quả là object thường, dễ xử lý hơn

    //  Lấy tất cả biến thể theo productId
    const productIds = products.map((p) => p._id);
    const allVariants = await ProductVariantModel.find({
      productId: { $in: productIds },
    });

    //  Gắn variants vào từng sản phẩm
    const productsWithVariants = products.map((product) => {
      const variants = allVariants.filter(
        (v) => v.productId.toString() === product._id.toString()
      );
      return {
        ...product,
        variants,
      };
    });

    return res.status(200).json({
      message: "All Products",
      data: productsWithVariants,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

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

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    //  Xoá tất cả biến thể liên quan đến sản phẩm
    await ProductVariantModel.deleteMany({ productId: req.params.id });

    return res.status(200).json({
      message: "Đã xóa sản phẩm và các biến thể liên quan",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

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