import mongoose from 'mongoose';

const mealSlotSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    mealType: { 
        type: String, 
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], 
        required: true 
    },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'recipe', required: true }
});

const mealPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    schedule: [mealSlotSchema]
}, { timestamps: true });

const mealPlanModel = mongoose.models.mealPlan || mongoose.model('mealPlan', mealPlanSchema);
export default mealPlanModel;
