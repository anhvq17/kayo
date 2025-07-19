import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';

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

    let originalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let totalAmount = originalAmount;
    let discount = 0;
    let discountType = undefined;
    let discountValue = undefined;
    let appliedVoucher = null;

    if (voucherCode) {
      // Tìm voucher hợp lệ
      const voucher = await import('../models/VoucherModel.js').then(m => m.default.findOne({ code: voucherCode.trim().toUpperCase(), deletedAt: null }));
      const now = new Date();
      if (voucher && voucher.status === 'activated' &&
        (!voucher.startDate || now >= voucher.startDate) &&
        (!voucher.endDate || now <= voucher.endDate) &&
        (!voucher.usageLimit || voucher.usedCount < voucher.usageLimit) &&
        (totalAmount >= (voucher.minOrderValue || 0))
      ) {
        // Tính discount
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
        // Tăng usedCount
        await voucher.updateOne({ $inc: { usedCount: 1 } });
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
      paymentStatus: 'Chưa thanh toán',
      voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
      discount,
      discountType,
      discountValue,
    });

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
    
    // Kiểm tra quy tắc cập nhật trạng thái tuần tự
    if (req.body.orderStatus) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const statusOrder = [
        'Chờ xử lý',
        'Đã xử lý', 
        'Đang giao hàng',
        'Đã giao hàng',
        'Đã nhận hàng'
      ];

      const currentIndex = statusOrder.indexOf(order.orderStatus);
      const newIndex = statusOrder.indexOf(req.body.orderStatus);

      // Kiểm tra quy tắc chuyển đổi
      let isValidTransition = 
        currentIndex === newIndex || // Cùng trạng thái
        newIndex === currentIndex + 1 || // Lên trạng thái tiếp theo
        newIndex === currentIndex - 1; // Xuống trạng thái trước đó (để sửa lỗi)

      // Kiểm tra hủy đơn hàng
      if (req.body.orderStatus === 'Đã huỷ đơn hàng') {
        isValidTransition = order.orderStatus === 'Chờ xử lý' || order.orderStatus === 'Đã xử lý';
      }

      // Kiểm tra yêu cầu hoàn hàng
      if (req.body.orderStatus === 'Yêu cầu hoàn hàng') {
        isValidTransition = order.orderStatus === 'Đã nhận hàng';
      }

      // Kiểm tra xử lý hoàn hàng (chỉ admin mới có thể thực hiện)
      if (req.body.orderStatus === 'Đã hoàn hàng' || req.body.orderStatus === 'Từ chối hoàn hàng') {
        isValidTransition = order.orderStatus === 'Yêu cầu hoàn hàng';
      }

      // Kiểm tra xác nhận đã nhận hàng (người dùng có thể xác nhận từ "Đã giao hàng")
      if (req.body.orderStatus === 'Đã nhận hàng') {
        isValidTransition = order.orderStatus === 'Đã giao hàng';
      }

      if (!isValidTransition) {
        if (req.body.orderStatus === 'Đã huỷ đơn hàng') {
          return res.status(400).json({ 
            error: 'Chỉ có thể hủy đơn hàng khi đang ở trạng thái "Chờ xử lý" hoặc "Đã xử lý"' 
          });
        } else if (req.body.orderStatus === 'Yêu cầu hoàn hàng') {
          return res.status(400).json({ 
            error: 'Chỉ có thể yêu cầu hoàn hàng khi đơn hàng đã được nhận' 
          });
        } else if (req.body.orderStatus === 'Đã hoàn hàng' || req.body.orderStatus === 'Từ chối hoàn hàng') {
          return res.status(400).json({ 
            error: 'Chỉ có thể xử lý hoàn hàng khi đơn hàng đang ở trạng thái "Yêu cầu hoàn hàng"' 
          });
        } else if (req.body.orderStatus === 'Đã nhận hàng') {
          return res.status(400).json({ 
            error: 'Chỉ có thể xác nhận đã nhận hàng khi đơn hàng đang ở trạng thái "Đã giao hàng"' 
          });
        } else {
          return res.status(400).json({ 
            error: 'Không thể chuyển từ trạng thái hiện tại sang trạng thái này. Vui lòng cập nhật theo thứ tự: Chờ xử lý → Đã xử lý → Đang giao hàng → Đã giao hàng → Đã nhận hàng' 
          });
        }
      }
    }
    
    // Nếu trạng thái đơn hàng được cập nhật thành "Đã nhận hàng" 
    // thì tự động cập nhật trạng thái thanh toán thành "Đã thanh toán"
    // (Áp dụng cho cả COD và VNPAY - khi khách hàng đã nhận hàng thì coi như đã thanh toán)
    if (req.body.orderStatus === 'Đã nhận hàng') {
      updateData.paymentStatus = 'Đã thanh toán';
    }
    
    // Nếu trạng thái đơn hàng được cập nhật thành "Đã hoàn hàng" 
    // thì tự động cập nhật trạng thái thanh toán thành "Đã hoàn tiền" cho cả COD và VNPAY
    if (req.body.orderStatus === 'Đã hoàn hàng') {
      updateData.paymentStatus = 'Đã hoàn tiền';
    }

    // Nếu trạng thái đơn hàng được cập nhật thành "Đã huỷ đơn hàng" 
    // và phương thức thanh toán là VNPAY thì tự động cập nhật trạng thái thanh toán thành "Đã hoàn tiền"
    if (req.body.orderStatus === 'Đã huỷ đơn hàng') {
      const order = await Order.findById(req.params.id);
      if (order && order.paymentMethod === 'vnpay') {
        updateData.paymentStatus = 'Đã hoàn tiền';
      }
    }
    
    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
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