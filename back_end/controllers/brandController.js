import BrandModel from "../models/BrandModel.js";
import { brandSchema } from "../validations/brand.js";
import ProductModel from "../models/ProductModel.js"

// Lấy tất cả brand chưa bị xoá mềm
export const getAllBrands = async (req, res) => {
    try {
        const brands = await BrandModel.find({ deletedAt: null }).lean().sort({ createdAt: -1 }) ; 

        const brandsWithCount = await Promise.all(
            brands.map(async (brand) => {
                const productCount = await ProductModel.countDocuments({ brandId: brand._id });
                return { ...brand, productCount };
            })
        );
        res.status(200).json({
            message: "Danh sách thương hiệu",
            data: brandsWithCount,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy chi tiết một brand
export const getBrandDetail = async (req, res) => {
    try {
        const brand = await BrandModel.findById(req.params.id);
        if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

        return res.status(200).json({
            message: "Chi tiết thương hiệu",
            data: brand,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Tạo brand mới
export const createBrand = async (req, res) => {
    try {
        const { error } = brandSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: "Validation failed", errors });
        }

        const brand = await BrandModel.create(req.body);
        return res.status(200).json({
            message: "Tạo thương hiệu thành công",
            data: brand,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Cập nhật brand
export const updateBrand = async (req, res) => {
    try {
        const { error } = brandSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: "Validation failed", errors });
        }

        const brand = await BrandModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

        return res.status(200).json({
            message: "Cập nhật thương hiệu thành công",
            data: brand,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Xoá mềm một brand
export const softDeleteBrand = async (req, res) => {
    try {
        const brand = await BrandModel.findByIdAndUpdate(req.params.id, {
            deletedAt: new Date(),
        });
        if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

        return res.status(200).json({ message: "Đã chuyển thương hiệu vào thùng rác" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Xoá mềm nhiều brand
export const softDeleteManyBrands = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
        }

        const result = await BrandModel.updateMany(
            { _id: { $in: ids } },
            { deletedAt: new Date() }
        );

        return res.status(200).json({
            message: "Đã chuyển các thương hiệu vào thùng rác",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách brand đã bị xoá mềm
export const getTrashedBrands = async (req, res) => {
    try {
        const brands = await BrandModel.find({ deletedAt: { $ne: null } });
        return res.status(200).json({
            message: "Danh sách thương hiệu trong thùng rác",
            data: brands,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Khôi phục một brand
export const restoreBrand = async (req, res) => {
    try {
        const brand = await BrandModel.findByIdAndUpdate(req.params.id, {
            deletedAt: null,
        });
        if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

        return res.status(200).json({ message: "Khôi phục thương hiệu thành công" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Khôi phục nhiều brand
export const restoreManyBrands = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
        }

        const result = await BrandModel.updateMany(
            { _id: { $in: ids } },
            { deletedAt: null }
        );

        return res.status(200).json({
            message: "Khôi phục các thương hiệu thành công",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Xoá cứng một brand
export const hardDeleteBrand = async (req, res) => {
    try {
        const brand = await BrandModel.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

        return res.status(200).json({
            message: "Đã xoá vĩnh viễn thương hiệu",
            data: brand,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Xoá cứng nhiều brand
export const hardDeleteManyBrands = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
        }

        const result = await BrandModel.deleteMany({ _id: { $in: ids } });

        return res.status(200).json({
            message: "Xóa vĩnh viễn các thương hiệu thành công",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
