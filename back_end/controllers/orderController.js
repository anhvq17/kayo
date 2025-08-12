import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';
import VoucherModel from '../models/VoucherModel.js';
import VoucherUserModel from '../models/VoucherUserModel.js';
import User from '../models/UserModel.js';


export const createOrder = async (req, res) => {
  try {
    const { userId, fullName, phone, address, paymentMethod, items, voucherCode } = req.body;

    if (!userId || !fullName || !phone || !address || !items?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate address format
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

    // Tạo order trước để lấy order._id
    const order = await Order.create({
      userId,
      fullName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      originalAmount,
      orderStatus: 'Chờ xử lý',
      paymentStatus: paymentMethod === 'wallet' ? 'Đã thanh toán' : 'Chưa thanh toán',
      voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
      discount,
      discountType,
      discountValue,
    });

    // Nếu thanh toán bằng ví, kiểm tra số dư rồi trừ tiền, lưu lịch sử
    if (paymentMethod === 'wallet') {
      if (user.wallet < totalAmount) {
        // Xóa order vừa tạo để rollback
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

    // Tạo các OrderItem
    await Promise.all(items.map(item => OrderItem.create({
      orderId: order._id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price
    })));

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

export const updateOrder = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // ===== Quy tắc chuyển trạng thái =====
    if (req.body.orderStatus) {
      const statusOrder = [
        'Chờ xử lý',
        'Đã xử lý',
        'Đang giao hàng',
        'Đã giao hàng',
        'Đã nhận hàng'
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
          error: 'Không thể cập nhật trạng thái theo thứ tự này'
        });
      }
    }

    // ===== Cập nhật thanh toán khi nhận hàng =====
    if (req.body.orderStatus === 'Đã nhận hàng') {
      updateData.paymentStatus = 'Đã thanh toán';
      updateData.isPaid = true;
      updateData.paidAt = new Date();
    }

    // ===== Xử lý thanh toán ví khi chưa trừ =====
    if (updateData.paymentStatus === 'Đã thanh toán' && order.paymentMethod === 'wallet') {
      const user = await User.findById(order.userId);
      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

      if (order.paymentStatus !== 'Đã thanh toán') { // tránh trừ 2 lần
        if (user.wallet < order.totalAmount) {
          return res.status(400).json({ error: 'Số dư ví không đủ' });
        }
        user.wallet -= order.totalAmount;
        user.walletHistory.push({
          type: 'withdraw',
          amount: order.totalAmount,
          status: 'completed',
          note: `Thanh toán đơn hàng #${order._id}`
        });
        await user.save();
      }
    }

    // ===== Hoàn tiền khi "Đã hoàn hàng" =====
    if (req.body.orderStatus === 'Đã hoàn hàng') {
      if (order.paymentStatus !== 'Đã hoàn tiền') { // tránh hoàn 2 lần
        updateData.paymentStatus = 'Đã hoàn tiền';
        updateData.isPaid = false;

        const user = await User.findById(order.userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        if (['vnpay', 'cod', 'wallet'].includes(order.paymentMethod)) {
          user.wallet += order.totalAmount;
          user.walletHistory.push({
            type: 'refund',
            amount: order.totalAmount,
            status: 'completed',
            note: `Hoàn tiền đơn hàng #${order._id}`
          });
          await user.save();
        }
      }
    }

    // ===== Hoàn tiền khi "Đã huỷ đơn hàng" =====
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
            note: `Hoàn tiền đơn hàng (hủy) #${order._id}`
          });
          await user.save();
        }
      }
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (order.isPaid) {
      return res.status(400).json({ message: 'Đơn hàng đã được thanh toán' });
    }

    if (paymentMethod === "wallet") {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      if (user.wallet < order.totalAmount) {
        return res.status(400).json({ message: 'Số dư ví không đủ' });
      }

      user.wallet -= order.totalAmount;
      user.walletHistory.push({
        type: 'withdraw',
        amount: order.totalAmount,
        status: 'completed',
        note: `Thanh toán đơn hàng #${order._id}`
      });
      await user.save();
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = paymentMethod;
    order.paymentStatus = 'Đã thanh toán';
    await order.save();

    res.json({ message: 'Thanh toán thành công', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
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


