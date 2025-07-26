import multer from 'multer';
import path from 'path';

// Thiết lập nơi lưu trữ
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu ảnh
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Kiểm tra loại file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận định dạng ảnh jpeg, jpg, png'));
  }
};

// Khởi tạo upload middleware
const upload = multer({
  storage,
  fileFilter
});

export default upload;
