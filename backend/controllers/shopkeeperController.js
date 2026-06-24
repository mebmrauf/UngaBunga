import storeModel from "../models/storeModel.js";
import orderModel from "../models/orderModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const setupStore = asyncHandler(async (req, res) => {
    const { storeName, address } = req.body;
    
    // Check if store already exists for this shopkeeper
    const existingStore = await storeModel.findOne({ shopkeeper: req.user._id });
    if (existingStore) {
        return res.status(400).json({ success: false, message: "Store already exists for this account." });
    }

    const store = new storeModel({
        shopkeeper: req.user._id,
        storeName,
        address
    });

    await store.save();
    res.status(201).json({ success: true, message: "Store created successfully. Pending identity verification.", store });
});

const updateInventory = asyncHandler(async (req, res) => {
    const { inventory } = req.body;

    const store = await storeModel.findOneAndUpdate(
        { shopkeeper: req.user._id },
        { inventory },
        { new: true }
    );

    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    res.json({ success: true, message: "Inventory updated", store });
});

const getOrders = asyncHandler(async (req, res) => {
    const store = await storeModel.findOne({ shopkeeper: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    // Find all orders that have subOrders for this store
    const orders = await orderModel.find({ "subOrders.store": store._id })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    // Filter to only return the subOrder relevant to this shopkeeper
    const filteredOrders = orders.map(order => {
        const subOrder = order.subOrders.find(so => so.store.toString() === store._id.toString());
        return {
            orderId: order._id,
            user: order.user,
            subOrder,
            address: order.address,
            overallStatus: order.overallStatus,
            date: order.createdAt
        };
    });

    res.json({ success: true, orders: filteredOrders });
});

const getStore = asyncHandler(async (req, res) => {
    const store = await storeModel.findOne({ shopkeeper: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    res.json({ success: true, store });
});

export { setupStore, updateInventory, getOrders, getStore };
