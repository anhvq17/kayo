import User from '../models/userModel.js'; // nhớ đúng tên và đúng đường dẫn
import jwt from 'jsonwebtoken';

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (req, res) => {
  const { username, email, phone, password, role } = req.body;
  const user = await User.create({ username, email, phone, password, role });
  const token = createToken(user);
  res.status(201).json({ token, user });
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu sai' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ 
    token, 
    user: { 
      _id: user._id,
      username: user.username,
      phone: user.phone,
      role: user.role
    } 
  });
};

