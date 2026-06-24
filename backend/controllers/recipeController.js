import recipeModel from "../models/recipeModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// Upload a new recipe
const uploadRecipe = asyncHandler(async (req, res) => {
    const { title, description, ingredients, steps, prepTime, servingSize, images } = req.body;
    
    const recipe = new recipeModel({
        title,
        description,
        author: req.user._id, // Assumes user middleware sets req.user
        ingredients,
        steps,
        prepTime,
        servingSize,
        images
    });

    await recipe.save();
    res.status(201).json({ success: true, message: "Recipe uploaded successfully and pending approval.", recipe });
});

// Get recipe feed (trending, new, recommended)
const getFeed = asyncHandler(async (req, res) => {
    // For MVP, just return approved recipes ordered by newest
    const recipes = await recipeModel.find({ status: 'Approved' })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(20);
    
    res.json({ success: true, recipes });
});

// Get recipe details
const getRecipeById = asyncHandler(async (req, res) => {
    const recipe = await recipeModel.findById(req.params.id).populate('author', 'name');
    if (!recipe) {
        return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, recipe });
});

export { uploadRecipe, getFeed, getRecipeById };
