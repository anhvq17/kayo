import BrandModel from "../models/BrandModel"

export const getAllBrands = async (req,res) => {
    try {
        const brands = await BrandModel.find();
        return res.status(200).json({
            message: 'All Brands',
            data:brands
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const getBrandDetail = async (req,res) => {
    try {
        const brand = await BrandModel.findById(req.params.id);
        return res.status(200).json({
            message: 'Detail Brand',
            data:brand
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const deleteBrand = async (req,res) => {
    try {
        const brand = await BrandModel.findByIdAndDelete(req.params.id);
        if(!brand){
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        return res.status(200).json({
            message: 'Delete Brand',
            data:brand
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const updateBrand = async (req,res) => {
    try {
        const brand = await BrandModel.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        });
        if(!brand){
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        return res.status(200).json({
            message: 'Update Brand',
            data:brand
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}

export const createBrand = async (req,res) => {
    try {
        const brand = await BrandModel.create(req.body);
        return res.status(200).json({
            message: 'Create Brand',
            data:brand
        })
    } catch (error) {
         return res.status(400).json({
            message:error.message,
        })
    }
}