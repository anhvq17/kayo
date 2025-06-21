import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongoDB from "./config/db.js";
import commentsRoute from "./routes/comment.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";


import User from './models/userModel.js';
import productVariantRouter from "./routes/productVariantRoutes.js";


dotenv.config();
connectMongoDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DATN");

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc SĐT đã tồn tại.' });
    }

    const newUser = new User({ username, email, phone, password });
    await newUser.save();
    
    res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
});

// Routes
app.get('/', (req, res) => res.send('Hello from Home'));
app.use('/products', productRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/', authRouter);
app.use('/comments', commentsRoute);
app.use('/orders', orderRouter);

app.use('/variant',productVariantRouter)
app.use('/comments', commentsRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export const viteNodeApp = app;
