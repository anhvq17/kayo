import express from "express";
import mongoose from "mongoose";
import connectMongoDB from "./config/db";
import productRouter from "./routes/productRoutes";
import categoryRouter from "./routes/categoryRoutes";
import brandRouter from "./routes/brandRoutes";
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    console.log('Home');
    res.send('Hello from Home');
});
// routers
app.use('/products',productRouter)
app.use('/brands',brandRouter)
app.use('/categories',categoryRouter)

// Kết nối db
// mongoose.connect(``);
connectMongoDB('mongodb://127.0.0.1:27017/DATN')



export const viteNodeApp = app;
