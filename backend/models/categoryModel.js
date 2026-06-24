import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    subCategories: [{
        name: { type: String, required: true },
        value: { type: String, required: true }
    }]
})

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;
