import cartModel from "../models/cartModel.js";
import mealPlanModel from "../models/mealPlanModel.js";
import storeModel from "../models/storeModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateCart = asyncHandler(async (req, res) => {
    const { mealPlanId } = req.body;

    const plan = await mealPlanModel.findById(mealPlanId).populate({
        path: 'schedule.recipe',
        select: 'ingredients'
    });

    if (!plan) return res.status(404).json({ success: false, message: "Meal plan not found" });

    // Consolidate ingredients
    const ingredientMap = new Map();
    plan.schedule.forEach(slot => {
        if (slot.recipe && slot.recipe.ingredients) {
            slot.recipe.ingredients.forEach(ing => {
                const key = `${ing.name.toLowerCase()}_${ing.unit}`;
                if (ingredientMap.has(key)) {
                    ingredientMap.get(key).totalQuantity += ing.quantity;
                } else {
                    ingredientMap.set(key, { name: ing.name, totalQuantity: ing.quantity, unit: ing.unit });
                }
            });
        }
    });

    const consolidatedItems = Array.from(ingredientMap.values());

    // Basic mapping: find a store that has the item (simplistic MVP logic)
    // In reality, this would search across stores or let users choose a store.
    const defaultStore = await storeModel.findOne({ status: 'Active' });
    
    if (defaultStore) {
        consolidatedItems.forEach(item => {
            // Find in store inventory
            const storeItem = defaultStore.inventory.find(i => i.name.toLowerCase() === item.name.toLowerCase());
            if (storeItem) {
                item.shopkeeperId = defaultStore._id;
                item.priceEstimate = storeItem.price * item.totalQuantity;
            }
        });
    }

    const totalEstimate = consolidatedItems.reduce((acc, curr) => acc + (curr.priceEstimate || 0), 0);

    const cart = new cartModel({
        user: req.user._id,
        items: consolidatedItems,
        totalEstimatedPrice: totalEstimate
    });

    await cart.save();
    res.json({ success: true, message: "Cart generated successfully", cart });
});

const updateCart = asyncHandler(async (req, res) => {
    const { cartId, items } = req.body;
    
    // Recalculate total estimate
    const totalEstimate = items.reduce((acc, curr) => acc + (curr.priceEstimate || 0), 0);

    const cart = await cartModel.findByIdAndUpdate(cartId, { items, totalEstimatedPrice: totalEstimate }, { new: true });
    
    res.json({ success: true, cart });
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await cartModel.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, cart });
});

export { generateCart, updateCart, getCart };
