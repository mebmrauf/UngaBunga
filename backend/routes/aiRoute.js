import express from 'express';
import { suggestPlan, suggestVariety } from '../controllers/aiController.js';
import authUser from '../middleware/auth.js';

const aiRouter = express.Router();

aiRouter.post('/suggest-plan', authUser, suggestPlan);
aiRouter.post('/suggest-variety', authUser, suggestVariety);

export default aiRouter;
