import mealPlanModel from "../models/mealPlanModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlan = asyncHandler(async (req, res) => {
    const { startDate, endDate, schedule } = req.body;
    
    // Simplistic version: Just overwrite existing plan or create new
    const plan = new mealPlanModel({
        user: req.user._id,
        startDate,
        endDate,
        schedule
    });

    await plan.save();
    res.status(201).json({ success: true, message: "Meal plan saved successfully", plan });
});

const getPlan = asyncHandler(async (req, res) => {
    const plan = await mealPlanModel.findOne({ user: req.user._id })
        .populate('schedule.recipe', 'title prepTime images')
        .sort({ createdAt: -1 });
        
    res.json({ success: true, plan });
});

export { createPlan, getPlan };
