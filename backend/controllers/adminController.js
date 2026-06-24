import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const dashboardStats = asyncHandler(async (req, res) => {
    const totalProducts = await productModel.countDocuments({});
    const totalCategories = await categoryModel.countDocuments({});
    const totalUsers = await userModel.countDocuments({});
    const totalOrders = await orderModel.countDocuments({});

    // Optional: Calculate total revenue
    const orders = await orderModel.find({ payment: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    res.json({
        success: true,
        stats: {
            products: totalProducts,
            categories: totalCategories,
            users: totalUsers,
            orders: totalOrders,
            revenue: totalRevenue
        }
    });
});

export { dashboardStats };
