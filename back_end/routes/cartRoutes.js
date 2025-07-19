import { Router } from 'express';
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItemQuantity,
  clearCartByUser,
  isCartEmpty,
  removeOrderedItems,
} from '../controllers/cartController.js';

const router = Router();

router.post('/', addToCart); // thêm sản phẩm
router.delete('/', removeFromCart); // xóa 1 sản phẩm
router.get('/user/:userId', getCart); // xem toàn bộ giỏ hàng
router.put('/', updateCartItemQuantity); // cập nhật số lượng
router.delete('/user/:userId', clearCartByUser); // xoá toàn bộ giỏ
router.get('/user/:userId/empty', isCartEmpty); // kiểm tra giỏ có trống
router.post('/remove-ordered', removeOrderedItems); // xoá sản phẩm đã đặt hàng

export default router;
