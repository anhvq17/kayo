import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import User from '../models/UserModel.js';

const router = express.Router();

// ✅ Đăng ký người dùng mới
router.post('/register', register);

// ✅ Đăng nhập
router.post('/login', login);

// ✅ Route kiểm tra quyền Admin
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.send('Chào admin');
});

// ✅ Route kiểm tra quyền user hoặc admin
router.get('/user', protect, authorize('user', 'admin'), (req, res) => {
  res.send(`Chào ${req.user.role}`);
});

// ✅ Lấy danh sách toàn bộ người dùng
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ✅ Cập nhật trạng thái hoạt động / khóa của người dùng
router.patch('/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    // ❌ Không được phép khóa Admin
    if (user.role.toLowerCase() === 'admin') {
      return res.status(403).json({ message: 'Không thể thay đổi trạng thái Admin.' });
    }

    // Đảo trạng thái isActive
    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'Cập nhật trạng thái thành công', isActive: user.isActive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
router.patch('/:id', async (req, res) => {
  try {
    const { username, email, phone, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, address, avatar },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json({ message: 'Cập nhật thành công', user });
  } catch (error) {
    console.error('Lỗi cập nhật:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
