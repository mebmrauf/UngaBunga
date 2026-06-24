import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    comment: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

const inventoryItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Basmati Rice"
    price: { type: Number, required: true }, // Price per unit
    unit: { type: String, required: true }, // e.g., "kg", "pcs", "liter"
    inStock: { type: Boolean, default: true }
});

const storeSchema = new mongoose.Schema({
    shopkeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    storeName: { type: String, required: true },
    address: { type: String, required: true },
    identityVerified: { type: Boolean, default: false },
    status: { 
        type: String, 
        enum: ['Active', 'Suspended', 'Banned'], 
        default: 'Active' 
    },
    inventory: [inventoryItemSchema],
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema]
}, { timestamps: true });

const storeModel = mongoose.models.store || mongoose.model('store', storeSchema);
export default storeModel;
