import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// Placing orders using COD Method (from Cart)
const placeOrder = asyncHandler(async (req, res) => {
    const { address, cartId } = req.body;

    const cart = await cartModel.findById(cartId);
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty or not found" });
    }

    // Split items by shopkeeper
    const storeMap = new Map();
    let totalItemsPrice = 0;

    cart.items.forEach(item => {
        if (!item.checked && item.shopkeeperId) { // Only order items they didn't check off
            const storeId = item.shopkeeperId.toString();
            if (!storeMap.has(storeId)) {
                storeMap.set(storeId, { store: storeId, items: [], subTotal: 0 });
            }
            const storeGroup = storeMap.get(storeId);
            
            storeGroup.items.push({
                name: item.name,
                quantity: item.totalQuantity,
                unit: item.unit,
                price: item.priceEstimate
            });
            storeGroup.subTotal += item.priceEstimate;
            totalItemsPrice += item.priceEstimate;
        }
    });

    const subOrders = Array.from(storeMap.values());
    const deliveryFee = 60; // Example
    const serviceFee = 20;

    const newOrder = new orderModel({
        user: req.user._id,
        subOrders,
        totalAmount: totalItemsPrice + deliveryFee + serviceFee,
        deliveryFee,
        serviceFee,
        address,
        paymentMethod: "COD",
        payment: false
    });

    await newOrder.save();

    // Clear cart or delete it
    await cartModel.findByIdAndDelete(cartId);

    res.json({ success: true, message: "Order Placed Successfully", order: newOrder });
});

// All Orders data for Admin Panel
const allOrders = asyncHandler(async (req, res) => {
    const orders = await orderModel.find({})
        .populate('user', 'name')
        .populate('subOrders.store', 'storeName')
        .sort({createdAt: -1});
    res.json({ success: true, orders });
});

// User Order Data for Frontend
const userOrders = asyncHandler(async (req, res) => {
    const orders = await orderModel.find({ user: req.user._id }).sort({createdAt: -1});
    res.json({ success: true, orders });
});

// Update overall order status from Admin/Delivery Panel
const updateStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { overallStatus: status });
    res.json({ success: true, message: "Status Updated" });
});

export { placeOrder, allOrders, userOrders, updateStatus };
