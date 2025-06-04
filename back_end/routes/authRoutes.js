import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.send('Chào admin');
});

router.get('/user', protect, authorize('user', 'admin'), (req, res) => {
  res.send(`Chào ${req.user.role}`);
});

export default router;
