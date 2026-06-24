import express from 'express';
import { createBounty, getBounties, submitRecipe, acceptSubmission } from '../controllers/bountyController.js';
import authUser from '../middleware/auth.js';

const bountyRouter = express.Router();

bountyRouter.post('/create', authUser, createBounty);
bountyRouter.get('/', getBounties); // Allow viewing without auth, or maybe require auth. Let's make it public to see.
bountyRouter.post('/submit', authUser, submitRecipe);
bountyRouter.post('/accept', authUser, acceptSubmission);

export default bountyRouter;
