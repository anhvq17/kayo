import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    req.user = user; // gán user cho req để dùng tiếp
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
