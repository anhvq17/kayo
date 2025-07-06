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

import userRoutes from './routes/authRoutes.js';
import attributeRouter from "./routes/attributeRoutes.js";
import attributeValueRouter from "./routes/attributeValueRouter.js";
import variantRouter from "./routes/variantRoutes.js";

import User from './models/UserModel.js';

dotenv.config();
connectMongoDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DATN");

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.get('/', (req, res) => res.send('Hello from Home'));
app.use('/products', productRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/comments', commentsRoute);
app.use('/orders', orderRouter);
// 
app.use('/payment', paymentRouter);
// 
app.use('/attribute',attributeRouter)
app.use('/attribute-value',attributeValueRouter)
app.use('/variant',variantRouter)
app.use('/users', userRoutes);
app.use('/', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export const viteNodeApp = app;
