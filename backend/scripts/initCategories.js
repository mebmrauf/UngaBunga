import 'dotenv/config';
import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";

const initializeCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const initialCategories = [
            {
                name: "Fresh Produce",
                value: "fresh_produce",
                subCategories: [
                    { name: "Fruits", value: "fruits" },
                    { name: "Vegetables", value: "vegetables" }
                ]
            },
            {
                name: "Dairy & Eggs",
                value: "dairy_eggs",
                subCategories: [
                    { name: "Dairy Products", value: "dairy_products" },
                    { name: "Eggs", value: "eggs" }
                ]
            },
            {
                name: "Meat & Seafood",
                value: "meat_seafood",
                subCategories: [
                    { name: "Meat", value: "meat" },
                    { name: "Seafood", value: "seafood" }
                ]
            },
            {
                name: "Pantry Staples",
                value: "pantry_staples",
                subCategories: [
                    { name: "Rice", value: "rice" },
                    { name: "Flour and Baking Supplies", value: "flour_baking" },
                    { name: "Pasta & Noodles", value: "pasta_noodles" },
                    { name: "Oils", value: "oils" }
                ]
            },
            {
                name: "Beverages",
                value: "beverages",
                subCategories: [
                    { name: "Tea & Coffee", value: "tea_coffee" },
                    { name: "Jucies", value: "jucies" },
                    { name: "Soft Drinks", value: "soft_drinks" }
                ]
            },
            {
                name: "Snacks",
                value: "snacks",
                subCategories: [
                    { name: "Chips", value: "chips" },
                    { name: "Cookies", value: "cookies" }
                ]
            }
        ];

        for (const cat of initialCategories) {
            const exists = await categoryModel.findOne({ value: cat.value });
            if (!exists) {
                await categoryModel.create(cat);
                console.log(`Created category: ${cat.name}`);
            } else {
                console.log(`Category already exists: ${cat.name}`);
            }
        }

        console.log("Initialization complete!");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

initializeCategories();
