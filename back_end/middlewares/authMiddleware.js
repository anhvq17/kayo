import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// ✅ Middleware bảo vệ route
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc thiếu Bearer' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // ✅ Kiểm tra nếu tài khoản bị khóa
    if (!req.user.isActive) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

    next();
  } catch (error) {
    console.error('Lỗi verify token:', error);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// ✅ Middleware phân quyền theo role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
};
