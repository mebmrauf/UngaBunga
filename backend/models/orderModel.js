import mongoose from "mongoose";

const subOrderSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'store', required: true },
    items: [{
        name: String,
        quantity: Number,
        unit: String,
        price: Number
    }],
    subTotal: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Ready for Pickup', 'Picked Up'], 
        default: 'Pending' 
    }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    subOrders: [subOrderSchema], // Split the order among multiple shopkeepers
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    address: { type: Object, required: true },
    overallStatus: { 
        type: String, 
        enum: ['Order Received', 'Assigned to Shopkeeper', 'Shopping', 'Out for Delivery', 'Delivered'], 
        default: 'Order Received' 
    },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    deliveryPersonnel: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
