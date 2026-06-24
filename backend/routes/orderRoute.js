import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);

// User features
orderRouter.post('/userorders', authUser, userOrders);

// Delivery features
orderRouter.get('/delivery-list', authUser, allOrders);
orderRouter.put('/delivery-status', authUser, updateStatus);

export default orderRouter;
