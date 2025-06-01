import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["activated", "inactivated"],
        default: "activated",
        required: true,
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
    CategorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('categories',CategorySchema)

