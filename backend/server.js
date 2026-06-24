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
import bountyRouter from "./routes/bountyRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import errorHandler from "./middleware/errorHandler.js";

import http from 'http';
import { Server } from 'socket.io';

// App config
const app = express();
const port = process.env.PORT || 5005;
connectDB();
connectCloudinary();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    
    // Client can join a room matching their user ID to receive direct notifications
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room.`);
    });

    // Delivery agent broadcasts their location
    socket.on('driverLocationUpdate', (data) => {
        const { orderId, userId, lat, lng } = data;
        // Broadcast to the specific customer's room
        io.to(userId).emit('locationUpdate', { orderId, lat, lng });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

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
app.use('/api/bounty', bountyRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);

app.get('/', (req, res) => {
    res.send("API Working")
})

// Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    server.listen(port, () => console.log(`Server started on port ${port}`));
}

export { app, server, io };
