import CategoryModel from "../models/CategoryModel.js";
import ProductModel from "../models/ProductModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await ProductModel.countDocuments({ categoryId: category._id });
        return {
          ...category.toObject(),
          productCount: count,
        };
      })
    );

    return res.status(200).json({
      message: "All Categories with Product Count",
      data: categoriesWithCount,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getCategoryDetail = async (req,res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        return res.status(200).json({
            message: 'Detail Category',
            data:category
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const deleteCategory = async (req,res) => {
    try {
        const category = await CategoryModel.findByIdAndDelete(req.params.id);
        if(!category){
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        return res.status(200).json({
            message: 'Delete Category',
            data:category
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const updateCategory = async (req,res) => {
    try {
        const category = await CategoryModel.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        });
        if(!category){
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        return res.status(200).json({
            message: 'Update Category',
            data:category
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const createCategory = async (req,res) => {
    try {
        const category = await CategoryModel.create(req.body);
        return res.status(200).json({
            message: 'Create Category',
            data:category
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}