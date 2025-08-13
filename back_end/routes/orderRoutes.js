import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  getOrdersByUserWithItems,
  payOrder,
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js'; // nhớ import middleware bảo vệ

const router = Router();

// Route tạo đơn hàng
router.post('/', createOrder);

// Route lấy toàn bộ đơn hàng
router.get('/', getAllOrders);

// Route lấy đơn hàng kèm items của 1 user
router.get('/user/:userId/full', getOrdersByUserWithItems);

// Route lấy đơn hàng của 1 user
router.get('/user/:userId', getOrdersByUser);

// Route thanh toán đơn hàng (ĐẶT TRƯỚC /:id)
router.put('/:orderId/pay', protect, payOrder);

// Route lấy chi tiết đơn hàng theo id
router.get('/:id', getOrderById);

// Route cập nhật đơn hàng
router.put('/:id', updateOrder);

// Route xóa đơn hàng
router.delete('/:id', deleteOrder);

export default router;
