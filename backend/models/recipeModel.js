import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    optional: { type: Boolean, default: false }
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    ingredients: [ingredientSchema],
    steps: [{ type: String, required: true }],
    prepTime: { type: Number }, // in minutes
    servingSize: { type: Number },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    }
}, { timestamps: true });

const recipeModel = mongoose.models.recipe || mongoose.model('recipe', recipeSchema);
export default recipeModel;
