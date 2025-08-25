import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';
import VoucherModel from '../models/VoucherModel.js';
import VoucherUserModel from '../models/VoucherUserModel.js';
import VariantModel from '../models/VariantModel.js';
import User from '../models/UserModel.js';
import { sendMail } from "../config/mailer.js"; 
import { notifyOrderStatus } from "../server.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, fullName, phone, address, paymentMethod, items, voucherCode } = req.body;

    if (!userId || !fullName || !phone || !address || !items?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!address.fullAddress && (!address.province || !address.district || !address.ward || !address.detail)) {
      return res.status(400).json({ message: "Invalid address format" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    let originalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let totalAmount = originalAmount;
    let discount = 0;
    let discountType = undefined;
    let discountValue = undefined;
    let appliedVoucher = null;

    if (voucherCode) {
      const voucher = await VoucherModel.findOne({
        code: voucherCode.trim().toUpperCase(),
        deletedAt: null
      });

      const now = new Date();
      if (voucher && voucher.status === 'activated' &&
        (!voucher.startDate || now >= voucher.startDate) &&
        (!voucher.endDate || now <= voucher.endDate) &&
        (!voucher.usageLimit || voucher.usedCount < voucher.usageLimit) &&
        (totalAmount >= (voucher.minOrderValue || 0))
      ) {
        const userVoucher = await VoucherUserModel.findOne({
          userId,
          voucherId: voucher._id
        });

        if (!userVoucher) {
          return res.status(400).json({ message: "Bạn chưa lưu mã giảm giá này" });
        }

        discountType = voucher.discountType;
        discountValue = voucher.discountValue;
        if (voucher.discountType === 'percent') {
          discount = Math.round(totalAmount * (voucher.discountValue / 100));
          if (voucher.maxDiscountValue) {
            discount = Math.min(discount, voucher.maxDiscountValue);
          }
        } else if (voucher.discountType === 'fixed') {
          discount = Math.min(voucher.discountValue, totalAmount);
        }
        appliedVoucher = voucher;

        await VoucherModel.findByIdAndUpdate(voucher._id, { $inc: { usedCount: 1 } });
        await VoucherUserModel.deleteOne({ userId, voucherId: voucher._id });
      }
    }

    totalAmount = totalAmount - discount;

    const order = await Order.create({
      userId,
      fullName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      originalAmount,
      orderStatus: 'Chờ xử lý',
      // Cho phép đánh dấu đã thanh toán ngay khi tạo nếu đã xác nhận thanh toán (VD: VNPay thành công)
      paymentStatus: paymentMethod === 'wallet'
        ? 'Đã thanh toán'
        : (req.body.isPaid === true ? 'Đã thanh toán' : 'Chưa thanh toán'),
      voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
      discount,
      discountType,
      discountValue,
    });

    // Emit real-time event for newly created order
    try {
      notifyOrderStatus(order._id.toString(), order.orderStatus, userId.toString());
    } catch (_) {}

    if (paymentMethod === 'wallet') {
      if (user.wallet < totalAmount) {
        await Order.findByIdAndDelete(order._id);
        return res.status(400).json({ message: "Số dư ví không đủ để thanh toán" });
      }
      user.wallet -= totalAmount;
      user.walletHistory.push({
        type: 'withdraw',
        amount: totalAmount,
        status: 'completed',
        note: `Thanh toán đơn hàng #${order._id}`
      });
      await user.save();
    }

    await Promise.all(items.map(async (item) => {
      const variant = await VariantModel.findById(item.variantId).populate("productId");
      if (!variant) throw new Error("Biến thể không tồn tại");

      if (variant.stock < item.quantity) {
        throw new Error(`Sản phẩm ${variant.productId.name} không đủ hàng`);
      }

     variant.stock_quantity -= item.quantity;
    await variant.save();

      await OrderItem.create({
        orderId: order._id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      });
    }));

    return res.status(201).json({ message: 'Order created', orderId: order._id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId');
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = await OrderItem.find({ orderId: order._id }).populate({
      path: 'variantId',
      populate: [
        { path: 'productId', model: 'products' },
        { path: 'attributes.attributeId', model: 'attributes' },
        { path: 'attributes.valueId', model: 'attribute_values' }
      ]
    });

    return res.status(200).json({ order, items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUserWithItems = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate({
          path: 'variantId',
          populate: [
            { path: 'productId', model: 'products' },
            { path: 'attributes.attributeId', model: 'attributes' },
            { path: 'attributes.valueId', model: 'attribute_values' }
          ]
        });
        return { ...order.toObject(), items };
      })
    );
    return res.status(200).json(ordersWithItems);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ updateOrder sửa lại cho chuẩn hoàn kho
export const updateOrder = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Kiểm tra chuyển trạng thái
    if (req.body.orderStatus) {
      const statusOrder = [
        'Chờ xử lý',
        'Đã xử lý',
        'Đang giao hàng',
        'Đã giao hàng',
        'Đã nhận hàng',
      ];

      const currentIndex = statusOrder.indexOf(order.orderStatus);
      const newIndex = statusOrder.indexOf(req.body.orderStatus);

      let isValidTransition =
        currentIndex === newIndex ||
        newIndex === currentIndex + 1 ||
        newIndex === currentIndex - 1;

      if (req.body.orderStatus === 'Đã huỷ đơn hàng') {
        isValidTransition = ['Chờ xử lý', 'Đã xử lý'].includes(order.orderStatus);
      }
      if (req.body.orderStatus === 'Yêu cầu hoàn hàng') {
        isValidTransition = ['Đã nhận hàng', 'Từ chối hoàn hàng', 'Yêu cầu hoàn hàng'].includes(order.orderStatus);
      }
      if (['Đã hoàn hàng', 'Từ chối hoàn hàng'].includes(req.body.orderStatus)) {
        isValidTransition = order.orderStatus === 'Yêu cầu hoàn hàng';
      }
      if (req.body.orderStatus === 'Đã nhận hàng') {
        isValidTransition = order.orderStatus === 'Đã giao hàng';
      }

      if (!isValidTransition) {
        return res.status(400).json({
          error: 'Không thể cập nhật trạng thái theo thứ tự này',
        });
      }
    }

    // ✅ Khi khách xác nhận đã nhận hàng thì đánh dấu đã thanh toán
    if (req.body.orderStatus === 'Đã nhận hàng') {
      updateData.paymentStatus = 'Đã thanh toán';
      updateData.isPaid = true;
      updateData.paidAt = new Date();
    }

    // ✅ Lưu yêu cầu hoàn hàng ở cấp item + ảnh minh chứng
    if (req.body.orderStatus === 'Yêu cầu hoàn hàng') {
      // Cho phép client gửi danh sách returnItems: [{ orderItemId, variantId, quantity }]
      let incomingReturnItems = req.body.returnItems;
      if (typeof incomingReturnItems === 'string') {
        try {
          incomingReturnItems = JSON.parse(incomingReturnItems);
        } catch (_) {
          incomingReturnItems = [];
        }
      }
      if (Array.isArray(incomingReturnItems) && incomingReturnItems.length > 0) {
        updateData.returnItems = incomingReturnItems.map((ri) => ({
          orderItemId: ri.orderItemId,
          variantId: ri.variantId,
          quantity: Math.max(1, Number(ri.quantity || 1)),
        }));
      }

      // Lưu đường dẫn ảnh upload nếu có
      if (Array.isArray(req.files) && req.files.length > 0) {
        updateData.returnImages = req.files.map(f => `/uploads/${f.filename}`);
      }
    }

    // ✅ Hoàn hàng -> cộng lại kho + hoàn tiền (hỗ trợ hoàn 1 phần)
    if (req.body.orderStatus === 'Đã hoàn hàng') {
      // Tính số tiền hoàn dựa trên returnItems nếu có, ngược lại hoàn toàn bộ
      let refundAmount = 0;
      const orderItems = await OrderItem.find({ orderId: order._id });

      if (Array.isArray(order.returnItems) && order.returnItems.length > 0) {
        for (const ri of order.returnItems) {
          const matched = orderItems.find((oi) => oi._id.toString() === ri.orderItemId?.toString());
          if (!matched) continue;
          const quantityToReturn = Math.min(ri.quantity || 0, matched.quantity);
          if (quantityToReturn <= 0) continue;
          refundAmount += quantityToReturn * matched.price;
        }
      } else {
        // Không có returnItems -> hoàn toàn bộ
        for (const item of orderItems) {
          refundAmount += item.quantity * item.price;
        }
      }

      // ✅ Hoàn tiền (chỉ số tiền của sản phẩm đã hoàn)
      if (refundAmount > 0) {
        const user = await User.findById(order.userId);
        if (user) {
          user.wallet += refundAmount;
          user.walletHistory.push({
            type: 'refund',
            amount: refundAmount,
            status: 'completed',
            note: `Hoàn tiền đơn hàng #${order._id}`,
          });
          await user.save();
        }

        // Nếu hoàn toàn bộ số tiền đơn hàng -> đánh dấu đã hoàn tiền, ngược lại giữ trạng thái thanh toán hiện tại
        if (refundAmount >= order.totalAmount) {
          updateData.paymentStatus = 'Đã hoàn tiền';
          updateData.isPaid = false;
        } else {
          // Giữ nguyên thanh toán là 'Đã thanh toán' với các đơn đã nhận hàng
          updateData.paymentStatus = order.paymentStatus;
          updateData.isPaid = true;
        }
      }

      // ✅ Cộng lại kho theo returnItems nếu có, ngược lại cộng toàn bộ
      if (Array.isArray(order.returnItems) && order.returnItems.length > 0) {
        for (const ri of order.returnItems) {
          if (!ri.variantId || !ri.quantity) continue;
          await VariantModel.findByIdAndUpdate(
            ri.variantId,
            { $inc: { stock_quantity: ri.quantity } },
            { new: true }
          );
        }
      } else {
        for (const item of orderItems) {
          await VariantModel.findByIdAndUpdate(
            item.variantId,
            { $inc: { stock_quantity: item.quantity } },
            { new: true }
          );
        }
      }
    }

    // ✅ Hủy đơn -> cộng lại kho + hoàn tiền (nếu đã trả trước)
    if (req.body.orderStatus === 'Đã huỷ đơn hàng') {
      if (order.paymentStatus !== 'Đã hoàn tiền' && ['vnpay', 'wallet'].includes(order.paymentMethod)) {
        updateData.paymentStatus = 'Đã hoàn tiền';
        updateData.isPaid = false;

        const user = await User.findById(order.userId);
        if (user) {
          user.wallet += order.totalAmount;
          user.walletHistory.push({
            type: 'refund',
            amount: order.totalAmount,
            status: 'completed',
            note: `Hoàn tiền đơn hàng (hủy) #${order._id}`,
          });
          await user.save();
        }
      }

      // ✅ luôn cộng lại kho khi hủy đơn
      const orderItems = await OrderItem.find({ orderId: order._id });
      for (const item of orderItems) {
        await VariantModel.findByIdAndUpdate(
          item.variantId,
          { $inc: { stock_quantity: item.quantity } },
          { new: true }
        );
      }
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

    const statusColors = {
      'Chờ xử lý': '#FFC107',
      'Đã xử lý': '#17A2B8',
      'Đang giao hàng': '#9C27B0',
      'Đã giao hàng': '#4CAF50',
      'Đã nhận hàng': '#2196F3',
      'Đã huỷ đơn hàng': '#F44336',
      'Yêu cầu hoàn hàng': '#FF5722',
      'Đã hoàn hàng': '#8BC34A',
      'Từ chối hoàn hàng': '#607D8B'
    };

    const statusColor = statusColors[updated.orderStatus] || '#000';

    const subject = `[Sevend Perfume] Cập nhật đơn hàng #${order._id}`;

    const user = await User.findById(order.userId);
    if (user?.email) {
      const subject = `Cập nhật đơn hàng #${order._id}`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Xin chào <b>${user.username}</b>,</p>
          <p>
            Đơn hàng <b>#${order._id}</b> của bạn vừa được cập nhật trạng thái:
            <span style="font-size: 14px; font-weight: bold; color: ${statusColor};">
              ${updated.orderStatus}
            </span>
          </p>
          <h4>Chi tiết đơn hàng:</h4>
          <ul>
            <li><b>Ngày đặt:</b> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</li>
            <li><b>Tổng tiền:</b> ${order.totalAmount.toLocaleString()}</li>
            <li><b>Phương thức thanh toán:</b> ${order.paymentMethod}</li>
          </ul>
          <p>Bạn có thể theo dõi chi tiết đơn hàng tại: 
            <a href="http://localhost:5173/orders" style="color: #1a73e8;">Xem đơn hàng</a>
          </p>
            <p>
            Cảm ơn vì đã tin tưởng và lựa chọn <b>Sevend</b>. <br /> 
            Chúng tôi luôn sẵn sàng đồng hành và hỗ trợ bất cứ khi nào bạn cần.
          </p>
          <div style="background-color: #f7f7f7; padding: 15px; font-size: 12px; color: #888; text-align: center;">
            Đây là email tự động, vui lòng không trả lời trực tiếp.<br>
            Liên hệ hỗ trợ: <a href="mailto:support@sevend.vn">support@sevend.vn</a>
          </div>
        </div>
      `;
      await sendMail(user.email, subject, html);
    }

    // Emit real-time event for order update
    try {
      notifyOrderStatus(updated._id.toString(), updated.orderStatus, updated.userId?.toString?.());
    } catch (_) {}

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};



export const payOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const paymentMethod = req.body.paymentMethod || "wallet";

    // Lấy đơn hàng
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    if (order.paymentStatus === "Đã thanh toán") {
      return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });
    }

    // Lấy các sản phẩm trong đơn
    const orderItems = await OrderItem.find({ orderId }).populate("variantId");
    if (!orderItems.length) {
      return res.status(400).json({ message: "Đơn hàng không có sản phẩm" });
    }

    // ✅ Thanh toán bằng ví
    if (paymentMethod === "wallet") {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

      if (user.wallet < order.totalAmount) {
        return res.status(400).json({ message: "Số dư ví không đủ" });
      }

      user.wallet -= order.totalAmount;
      user.walletHistory.push({
        type: "withdraw",
        amount: order.totalAmount,
        status: "completed",
        note: `Thanh toán đơn hàng #${order._id}`,
      });
      await user.save();
    }

    // ✅ Trừ kho
    for (const item of orderItems) {
      const updated = await Variant.findOneAndUpdate(
        { _id: item.variantId, stock_quantity: { $gte: item.quantity } },
        { $inc: { stock_quantity: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        return res.status(400).json({
          message: `Sản phẩm trong kho không đủ cho biến thể ${item.variantId}`,
        });
      }
    }

    // ✅ Cập nhật trạng thái đơn hàng
    order.paymentStatus = "Đã thanh toán";
    order.paymentMethod = paymentMethod;
    await order.save();

    // Emit real-time event for payment update
    try {
      notifyOrderStatus(order._id.toString(), order.orderStatus, order.userId?.toString?.());
    } catch (_) {}

    res.json({ message: "Thanh toán thành công", order });
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};



export const deleteOrder = async (req, res) => {
  try {
    await OrderItem.deleteMany({ orderId: req.params.id });
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};