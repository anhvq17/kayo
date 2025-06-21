import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;