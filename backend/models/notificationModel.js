import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['recipe', 'order', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);
export default notificationModel;
