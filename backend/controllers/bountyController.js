import bountyModel from "../models/bountyModel.js";
import userModel from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new bounty
const createBounty = asyncHandler(async (req, res) => {
    const { title, description, rewardPoints } = req.body;
    
    if (rewardPoints <= 0) {
        return res.status(400).json({ success: false, message: "Reward points must be positive" });
    }

    const bounty = new bountyModel({
        requester: req.user._id,
        title,
        description,
        rewardPoints
    });

    await bounty.save();
    res.status(201).json({ success: true, message: "Bounty created successfully", bounty });
});

// Get all bounties
const getBounties = asyncHandler(async (req, res) => {
    const bounties = await bountyModel.find()
        .populate('requester', 'name')
        .populate({
            path: 'submissions.recipe',
            select: 'title image'
        })
        .populate({
            path: 'submissions.submittedBy',
            select: 'name'
        })
        .sort({ createdAt: -1 });
        
    res.json({ success: true, bounties });
});

// Submit a recipe to a bounty
const submitRecipe = asyncHandler(async (req, res) => {
    const { bountyId, recipeId } = req.body;
    const bounty = await bountyModel.findById(bountyId);

    if (!bounty) return res.status(404).json({ success: false, message: "Bounty not found" });
    if (bounty.status === 'Fulfilled') return res.status(400).json({ success: false, message: "Bounty already fulfilled" });

    // Ensure user hasn't already submitted
    const hasSubmitted = bounty.submissions.some(sub => sub.submittedBy.toString() === req.user._id.toString());
    if (hasSubmitted) return res.status(400).json({ success: false, message: "You have already submitted a recipe" });

    bounty.submissions.push({
        recipe: recipeId,
        submittedBy: req.user._id,
        status: 'Pending'
    });

    await bounty.save();
    res.json({ success: true, message: "Recipe submitted to bounty successfully" });
});

// Accept a submission
const acceptSubmission = asyncHandler(async (req, res) => {
    const { bountyId, submissionId } = req.body;
    const bounty = await bountyModel.findById(bountyId);

    if (!bounty) return res.status(404).json({ success: false, message: "Bounty not found" });
    if (bounty.requester.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Only the requester can accept submissions" });
    if (bounty.status === 'Fulfilled') return res.status(400).json({ success: false, message: "Bounty already fulfilled" });

    const submission = bounty.submissions.id(submissionId);
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

    // Mark submission as accepted
    submission.status = 'Accepted';
    bounty.status = 'Fulfilled';

    // Transfer points to the solver
    await userModel.findByIdAndUpdate(submission.submittedBy, { $inc: { points: bounty.rewardPoints } });

    await bounty.save();

    res.json({ success: true, message: "Submission accepted. Points transferred!" });
});

export { createBounty, getBounties, submitRecipe, acceptSubmission };
