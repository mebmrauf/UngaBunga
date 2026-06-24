import OpenAI from "openai";
import asyncHandler from "../utils/asyncHandler.js";
import recipeModel from "../models/recipeModel.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const suggestPlan = asyncHandler(async (req, res) => {
    const { days, mealsPerDay, preferences } = req.body;

    // We can fetch approved recipes to feed to the AI to choose from
    const recipes = await recipeModel.find({ status: 'Approved' }).select('title description prepTime ingredients');
    const recipeContext = recipes.map(r => ({ id: r._id, title: r.title, prepTime: r.prepTime }));

    const prompt = `
    You are an expert AI meal planner. Create a ${days}-day meal plan with ${mealsPerDay} meals per day.
    User Preferences: ${JSON.stringify(preferences || {})}
    Available Recipes (use the exact IDs): ${JSON.stringify(recipeContext)}
    
    Output JSON exactly matching this structure:
    {
      "plan": [
        {
          "date": "2024-10-01",
          "mealType": "Breakfast",
          "recipeId": "60d5ecb..."
        }
      ]
    }
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: prompt }],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        const parsedData = JSON.parse(content);

        res.json({ success: true, plan: parsedData.plan });
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ success: false, message: "AI generation failed. Fallback would run here." });
    }
});

const suggestVariety = asyncHandler(async (req, res) => {
    // Similar implementation
    res.json({ success: true, message: "Variety suggested" });
});

export { suggestPlan, suggestVariety };
