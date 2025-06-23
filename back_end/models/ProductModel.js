import mongoose from "mongoose";
import slugify from "slugify";
const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    slug: { 
        type: String, 
        unique: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    priceDefault: { 
        type: Number, 
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
        default: new mongoose.Types.ObjectId("6856d4125db3deb51cb069e1")
    },
    deletedAt: { 
        type: Date, 
        default: null 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Tự tạo slug từ name
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});
export default mongoose.model("products", ProductSchema);
