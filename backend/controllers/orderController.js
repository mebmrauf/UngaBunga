import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// Placing orders using COD Method
const placeOrder = asyncHandler(async (req, res) => {
    const { userId, items, amount, address } = req.body;

    const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "COD",
        payment: false,
        date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
});

// All Orders data for Admin Panel
const allOrders = asyncHandler(async (req, res) => {
    const orders = await orderModel.find({}).sort({date: -1});
    res.json({ success: true, orders });
});

// User Order Data for Frontend
const userOrders = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({date: -1});
    res.json({ success: true, orders });
});

// Update order status from Admin Panel
const updateStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
});

export { placeOrder, allOrders, userOrders, updateStatus };
