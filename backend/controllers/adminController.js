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

import notificationModel from "../models/notificationModel.js";

const updateRecipeStatus = asyncHandler(async (req, res) => {
    const { recipeId, status } = req.body;
    const recipe = await recipeModel.findByIdAndUpdate(recipeId, { status });
    
    if (recipe) {
        // Reward points if approved
        if (status === 'Approved' && recipe.status !== 'Approved') {
            await userModel.findByIdAndUpdate(recipe.author, { $inc: { points: 50 } });
        }
        
        // Create Notification
        const notification = new notificationModel({
            user: recipe.author,
            message: `Your recipe "${recipe.title}" has been ${status.toLowerCase()}!`,
            type: 'recipe'
        });
        await notification.save();

        // Emit via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.to(recipe.author.toString()).emit('newNotification', notification);
        }
    }

    res.json({ success: true, message: "Recipe status updated" });
});

export { dashboardStats, getUsers, updateUserRole, getAllRecipes, updateRecipeStatus };
