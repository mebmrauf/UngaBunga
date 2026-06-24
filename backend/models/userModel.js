import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'delivery', 'shopkeeper'], 
        default: 'user' 
    },
    preferences: {
        dietaryRestrictions: [{ type: String }],
        budget: { type: Number, default: 0 }
    },
    points: { type: Number, default: 0 }
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;