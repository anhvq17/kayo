import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true,
    },


    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brands",
        required: true,
    },

    status: {
        type: String,
        enum: ['Còn hàng', 'Hết hàng'],
        default: 'Còn hàng',
    },

    quantity: {
        type: Number,
        required: true,
        default: 0,
    },

    flavors: {
        type: [String],
        default: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

})
    // Cập nhật tự động updatedAt trước khi lưu
    ProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('products',ProductSchema)

