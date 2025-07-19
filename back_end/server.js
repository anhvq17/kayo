import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectMongoDB from "./config/db.js";

import commentsRoute from "./routes/comment.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import cartRoutes from './routes/cartRoutes.js';

import userRoutes from './routes/authRoutes.js';
import attributeRouter from "./routes/attributeRoutes.js";
import attributeValueRouter from "./routes/attributeValueRouter.js";
import variantRouter from "./routes/variantRoutes.js";

import http from "http";
import { Server } from "socket.io";
import voucherRouter from "./routes/voucherRoutes.js";

dotenv.config();
connectMongoDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DATN");

const app = express();
const server = http.createServer(app); // Tạo HTTP server từ Express

//  Tạo socket.io server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Cho phép kết nối từ FE
    methods: ["GET", "POST"],
  },
});

//  Lắng nghe kết nối từ client
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

//  Hàm gọi từ controller khi cập nhật đơn hàng
export const notifyOrderStatus = (orderId, status) => {
  io.emit("orderStatusChanged", { orderId, status });
};

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.get('/', (req, res) => res.send('Hello from Home'));
app.use('/cart', cartRoutes);
app.use('/products', productRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/comments', commentsRoute);
app.use('/orders', orderRouter);
app.use('/payment', paymentRouter);
app.use('/attribute', attributeRouter);
app.use('/attribute-value', attributeValueRouter);
app.use('/variant', variantRouter);
app.use('/users', userRoutes);
app.use('/voucher',voucherRouter)
app.use('/', authRouter);

//  Khởi chạy HTTP server (không dùng app.listen)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

//  Nếu bạn dùng vite-node cho testing
export const viteNodeApp = app;

app.use((req, res, next) => {
  res.status(404).json({ message: "Đường dẫn không tồn tại" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

