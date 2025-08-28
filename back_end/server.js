import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectMongoDB from "./config/db.js";
import path from "path";
import commentRouter from "./routes/comment.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import cartRoutes from './routes/cartRoutes.js';
import chatbotRoute from './routes/chatbot.js';
import userRoutes from './routes/authRoutes.js';
import attributeRouter from "./routes/attributeRoutes.js";
import attributeValueRouter from "./routes/attributeValueRouter.js";
import variantRouter from "./routes/variantRoutes.js";
import http from "http";
import { Server } from "socket.io";
import voucherRouter from "./routes/voucherRoutes.js";
import voucherUserRouter from "./routes/voucherUserRouter.js";
import walletRoutes from "./routes/wallet.js";
import cookieParser from "cookie-parser";
import faqRouter from "./routes/FaqRoutes.js";

console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectMongoDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/datn");

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

export const notifyOrderStatus = (orderId, status, userId) => {
  io.emit("orderStatusChanged", { orderId, status, userId });
};

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get('/', (req, res) => res.send('Hello from Home'));
app.use('/cart', cartRoutes);
app.use('/products', productRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/comments', commentRouter);
app.use('/orders', orderRouter);
app.use('/payment', paymentRouter);
app.use('/attribute', attributeRouter);
app.use('/attribute-value', attributeValueRouter);
app.use('/variant', variantRouter);
app.use('/users', userRoutes);
app.use('/voucher',voucherRouter) ; 
app.use("/voucher-user", voucherUserRouter);
app.use('/', authRouter);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/chatbot', chatbotRoute);
app.use("/api/wallet", walletRoutes);
app.use('/api/faqs', faqRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("=== ENV CHECK ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Không có giá trị");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Có giá trị" : "❌ Không có giá trị");
});

export const viteNodeApp = app;

app.use((req, res, next) => {
  res.status(404).json({ message: "Đường dẫn không tồn tại" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});