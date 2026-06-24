import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // The generic ingredient name
    totalQuantity: { type: Number, required: true },
    unit: { type: String, required: true },
    checked: { type: Boolean, default: false }, // If user already has it at home
    shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'store' }, // Mapped to a specific store
    priceEstimate: { type: Number, default: 0 }
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [cartItemSchema],
    totalEstimatedPrice: { type: Number, default: 0 }
}, { timestamps: true });

const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema);
export default cartModel;
