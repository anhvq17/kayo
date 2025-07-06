import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (req, res) => {
  const { username, email, phone, password, avatar, address, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc SĐT đã tồn tại.' });
    }

    const user = await User.create({ username, email, phone, password, avatar, address, role });

    const token = createToken(user);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
      }
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu sai' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    const token = createToken(user);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
      }
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
