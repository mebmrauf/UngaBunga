import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'recipe', required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['Pending', 'Accepted'], default: 'Pending' }
}, { _id: true }); // keep _id to easily reference the submission

const bountySchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rewardPoints: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Open', 'Fulfilled'], default: 'Open' },
    submissions: [submissionSchema]
}, { timestamps: true });

const bountyModel = mongoose.models.bounty || mongoose.model('bounty', bountySchema);
export default bountyModel;
