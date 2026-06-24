import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import recipeModel from "../models/recipeModel.js";
import storeModel from "../models/storeModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const dashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await userModel.countDocuments({});
    const totalOrders = await orderModel.countDocuments({});
    const totalRecipes = await recipeModel.countDocuments({});
    const totalStores = await storeModel.countDocuments({});

    res.json({
        success: true,
        stats: {
            users: totalUsers,
            orders: totalOrders,
            recipes: totalRecipes,
            stores: totalStores
        }
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;
    await userModel.findByIdAndUpdate(userId, { role });
    res.json({ success: true, message: "User role updated" });
});

const getAllRecipes = asyncHandler(async (req, res) => {
    const recipes = await recipeModel.find({}).populate('author', 'name').sort({ createdAt: -1 });
    res.json({ success: true, recipes });
});

const updateRecipeStatus = asyncHandler(async (req, res) => {
    const { recipeId, status } = req.body;
    await recipeModel.findByIdAndUpdate(recipeId, { status });
    res.json({ success: true, message: "Recipe status updated" });
});

export { dashboardStats, getUsers, updateUserRole, getAllRecipes, updateRecipeStatus };
