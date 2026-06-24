import categoryModel from "../models/categoryModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const listCategories = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find({});
    res.json({ success: true, categories });
});

const addCategory = asyncHandler(async (req, res) => {
    const { name, value, subCategories } = req.body;
    
    const exists = await categoryModel.findOne({ value });
    if (exists) {
        return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = new categoryModel({
        name,
        value,
        subCategories: subCategories || []
    });

    await category.save();
    res.json({ success: true, message: "Category added successfully" });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id, name, value, subCategories } = req.body;
    
    const category = await categoryModel.findByIdAndUpdate(id, { name, value, subCategories }, { new: true });
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category updated successfully", category });
});

const removeCategory = asyncHandler(async (req, res) => {
    const { id } = req.body;
    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category removed successfully" });
});

export { listCategories, addCategory, updateCategory, removeCategory };
