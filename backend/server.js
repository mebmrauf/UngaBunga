import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import recipeRouter from "./routes/recipeRoute.js";
import plannerRouter from "./routes/plannerRoute.js";
import cartRouter from "./routes/cartRoute.js";
import shopkeeperRouter from "./routes/shopkeeperRoute.js";
import aiRouter from "./routes/aiRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import errorHandler from "./middleware/errorHandler.js";

// App config
const app = express();
const port = process.env.PORT || 5005;
connectDB();
connectCloudinary();

// Middleware
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));

// Api end points
app.use('/api/user', userRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/cart', cartRouter);
app.use('/api/shopkeeper', shopkeeperRouter);
app.use('/api/ai', aiRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
    res.send("API Working")
})

// Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Server started on port ${port}`));
}

export default app;
