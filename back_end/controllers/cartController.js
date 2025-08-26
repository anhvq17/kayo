import Cart from '../models/CartModel.js';
import ProductVariant from "../models/VariantModel.js";
import mongoose from 'mongoose';

export const addToCart = async (req, res) => {
  try {
    const {
      userId,
      variantId,
      productId,
      name,
      image,
      price,
      selectedScent,
      selectedVolume,
      quantity,
    } = req.body;

    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant không tồn tại" });
    }

    const existingItem = await Cart.findOne({ userId, variantId });
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + quantity;

    // ❌ Nếu số lượng mới > tồn kho → chặn
    if (newQty > variant.stock_quantity) {
      return res.status(400).json({
        message: `Chỉ còn ${variant.stock_quantity} sản phẩm trong kho. Bạn đã có ${currentQty} trong giỏ.`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newQty;
      await existingItem.save();
      return res.status(200).json({ message: "Quantity updated", cartItem: existingItem });
    }

    const newItem = await Cart.create({
      userId,
      variantId,
      productId,
      name,
      image,
      price,
      selectedScent,
      selectedVolume,
      quantity,
    });

    res.status(201).json({ message: "Item added to cart", cartItem: newItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, variantId } = req.body;

    const deleted = await Cart.findOneAndDelete({ userId, variantId });

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await Cart.find({ userId })
      .populate('variantId')
      .sort({ updatedAt: -1 });

    res.status(200).json({ cart: items });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cart', error: err.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, variantId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant không tồn tại" });
    }

    if (quantity > variant.stock_quantity) {
      return res.status(400).json({
        message: `Chỉ còn ${variant.stock_quantity} sản phẩm trong kho`,
      });
    }

    const updatedItem = await Cart.findOneAndUpdate(
      { userId, variantId },
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Quantity updated", cartItem: updatedItem });
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity", error: err.message });
  }
};

export const clearCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Cart.deleteMany({ userId });

    res.status(200).json({ message: 'Cart cleared', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};

export const isCartEmpty = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Cart.countDocuments({ userId });

    res.status(200).json({ isEmpty: count === 0, itemCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Error checking cart', error: err.message });
  }
};

export const removeOrderedItems = async (req, res) => {
  try {
    const { userId, variantIds } = req.body;

    if (!userId || !Array.isArray(variantIds) || variantIds.length === 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const objectVariantIds = variantIds.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Cart.deleteMany({
      userId: userObjectId,
      $or: [
        { variantId: { $in: objectVariantIds } },
        { "variantId._id": { $in: objectVariantIds } }
      ]
    });

    res.status(200).json({
      message: "Đã xoá sản phẩm đã đặt khỏi giỏ",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Lỗi khi xoá sản phẩm:", err);
    res.status(500).json({
      message: "Lỗi khi xoá sản phẩm đã đặt",
      error: err.message,
    });
  }
};