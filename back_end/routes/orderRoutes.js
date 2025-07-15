import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  getOrdersByUserWithItems,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.get('/user/:userId/full', getOrdersByUserWithItems);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;