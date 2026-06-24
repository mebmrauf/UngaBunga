import express from 'express';
import { suggestPlan, suggestVariety, refinePlan } from '../controllers/aiController.js';
import authUser from '../middleware/auth.js';

const aiRouter = express.Router();

aiRouter.post('/suggest-plan', authUser, suggestPlan);
aiRouter.post('/suggest-variety', authUser, suggestVariety);
aiRouter.post('/refine-plan', authUser, refinePlan);

export default aiRouter;
